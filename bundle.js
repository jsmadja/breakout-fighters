(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Background {

    constructor(game) {
        this.game = game;
    }

    preload() {
        this.game.load.image('grid', 'assets/back/grid.png');
    }

    create(width, height) {
        this.game.add.tileSprite(0, 0, width, height, 'grid');
    }

}

module.exports = Background;
},{}],2:[function(require,module,exports){
const speed = 0.5;
class Ball {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.sprite = this.game.add.sprite(0, 0, 'sprites', 'ball.png');
        this.sprite.anchor.set(0.5);
        this.sprite.checkWorldBounds = true;
        this.type = Ball.Type.NEUTRAL;

        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.set(1);
        this.sprite.events.onOutOfBounds.add(this.onOutOfBounds, this);
    }

    setX(x) {
        this.sprite.body.x = x;
    }

    release() {
        this.sprite.body.velocity.y = -300 * speed;
        this.sprite.body.velocity.x = -75 * speed;
        this.sprite.animations.play('spin');
    }

    resetAt(x, y) {
        this.sprite.body.velocity.set(0);
        this.sprite.reset(x, y);
        this.sprite.animations.stop();
    }

    destroy() {
        this.sprite.body.velocity.setTo(0, 0);
    }

    get height() {
        return this.sprite.body.height;
    }

    get width() {
        return this.sprite.body.width;
    }

    get type() {
        return this.sprite.type;
    }

    set type(type) {
        this.sprite.type = type;
        if (type === Ball.Type.NEUTRAL) {
            this.sprite.frameName = 'ball.png';
        } else {
            this.sprite.frameName = `${type}/ball_${type}.png`;
        }
    }

    static get Type() {
        return {
            A: 'A',
            B: 'B',
            C: 'C',
            D: 'D',
            NEUTRAL: 'NEUTRAL',
        };
    }
}

module.exports = Ball;
},{}],3:[function(require,module,exports){
const GameEngine = require('./game-engine');
const Paddle = require('./paddle');
const Ball = require('./ball');
const Background = require('./background');

class BreakOutFighters {

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    preload(game) {
        this.gameEngine = new GameEngine(game);
        this.gameEngine.preload();

        this.background = new Background(game);
        this.background.preload();

        this.ball = new Ball(game);
        this.paddle = new Paddle(game);

        this.gameEngine.ball = this.ball;
        this.gameEngine.paddle = this.paddle;
    }

    create(game) {
        this.background.create(this.width, this.height);
        this.gameEngine.create();
        this.paddle.create();
        this.ball.create();
        this.paddle.reset(this.ball);

        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        //game.input.onDown.add(() => this.gofull(game), this);
    }

    gofull(game) {

        if (game.scale.isFullScreen) {
            game.scale.stopFullScreen();
        }
        else {
            game.scale.startFullScreen(false);
        }

    }

    update() {
        this.gameEngine.update();
    }

}

module.exports = BreakOutFighters;
},{"./background":1,"./ball":2,"./game-engine":7,"./paddle":13}],4:[function(require,module,exports){
class Brick {
    constructor(group, type, x, y) {
        const brick = group.create(x, y, 'sprites', `${type}/${type}.png`);
        brick.body.bounce.set(1);
        brick.body.immovable = true;
        brick.type = type;
    }

    static reflect(_ball, _brick) {
        if(_ball.type === _brick.type) {
            _brick.kill();
        }
        this.collidedBrick = _brick;
    }
}

const START_X = 3;
const START_Y = 30;
const BRICK_WIDTH = 20;
const BRICK_HEIGHT = 10;

class Bricks {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.group = this.game.add.group();
        this.group.enableBody = true;
        this.group.physicsBodyType = Phaser.Physics.ARCADE;
    }

    addBrickAt(type, x, y) {
        new Brick(this.group, type, x, y);
    }

    update(ball) {
        if (this.game.physics.arcade.collide(ball.sprite, this.group, Brick.reflect, null, this)) {
            this.onBallHitBrick(this.collidedBrick);
        }
    }

    reset() {
        this.group.callAll('revive');
    }

    createWall(data) {
        const rows = data.split('\n');
        let y = START_Y;
        rows.forEach(row => {
            const bricks = row.split('');
            let x = START_X;
            bricks.forEach(brick => {
                this.addBrickAt(brick, x, y);
                x += BRICK_WIDTH + 1;
            });
            y += BRICK_HEIGHT + 1;
        });
    }

    count() {
        return this.group.countLiving();
    }

}

module.exports = Bricks;
},{}],5:[function(require,module,exports){
class Controls {

    static get buttons() {
        return {
            A: Phaser.KeyCode.A,
            B: Phaser.KeyCode.Z,
            C: Phaser.KeyCode.E,
            D: Phaser.KeyCode.R,
            START: Phaser.Keyboard.SPACEBAR,
        };
    }

    static get joystick() {
        return {
            LEFT: Phaser.Keyboard.LEFT,
            RIGHT: Phaser.Keyboard.RIGHT,
            DOWN: Phaser.Keyboard.DOWN,
        };
    }
}

module.exports = Controls;
},{}],6:[function(require,module,exports){
const MAX_LIFE = 100;
const JUST_DEFEND_TIMING = 200;
const NORMAL_DAMAGE = 1;

class Player {
    constructor() {
        this.power = 0;
        this.reset();
    }

    receiveNormalDamage() {
        this.life -= NORMAL_DAMAGE;
    }

    reset() {
        this.restoreFullLife();
        this.rush = 0;
        this.justDefending = false;
    }

    restoreFullLife() {
        this.life = MAX_LIFE;
    }

    isKO() {
        return this.life <= 0;
    }

    justDefend() {
        if (!this.justDefending) {
            this.justDefending = true;
            setTimeout(() => {
                this.justDefending = false;
            }, JUST_DEFEND_TIMING);
        }
    }
}

module.exports = Player;
},{}],7:[function(require,module,exports){
const Player = require('./domain/player');
const Controls = require('./controls');
const Bricks = require('./bricks');
const HUD = require('./hud');
const Ball = require('./ball');

class GameEngine {
    constructor(game) {
        this.game = game;
        this.player = new Player();
        this.bricks = new Bricks(game);
        this.bricks.onBallHitBrick = this.onPlayerHitBrick.bind(this);
        this.hud = new HUD(game);
    }

    preload() {
        this.game.load.atlas('sprites', 'assets/sprites/sprite.png', 'assets/sprites/sprite.json');
        this.game.load.text('level_1', '../assets/levels/level_1/wall.data');
    }

    create() {
        this.game.stage.smoothed = false;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.bounds = new Phaser.Rectangle(0, 20, this.game.world.width, this.game.world.height);
        this.game.physics.arcade.checkCollision.down = false;
        this.bindControls();

        const level1 = this.game.cache.getText('level_1');
        this.bricks.create();
        this.bricks.createWall(level1);

        this.hud.create(this.player, this.bricks);
    }

    bindControls() {
        this.aButton = this.game.input.keyboard.addKey(Controls.buttons.A);
        this.bButton = this.game.input.keyboard.addKey(Controls.buttons.B);
        this.cButton = this.game.input.keyboard.addKey(Controls.buttons.C);
        this.dButton = this.game.input.keyboard.addKey(Controls.buttons.START);
        this.leftDirection = this.game.input.keyboard.addKey(Controls.joystick.LEFT);
        this.rightDirection = this.game.input.keyboard.addKey(Controls.joystick.RIGHT);
        this.downDirection = this.game.input.keyboard.addKey(Controls.joystick.DOWN);
    }

    onBallLost() {
        this.paddle.reset(this.ball);
        this.player.reset();
        this.bricks.reset();
        this.hud.playerLifeUIComponent.update(this.player.life);
        this.hud.levelLifeUIComponent.update(this.bricks.count());
    }

    onBallHitPlayer() {
        if (this.player.justDefending) {
            this.onPlayerJustDefended();
        } else {
            this.onPlayerReceiveNormalDamage();
        }
        if (this.player.isKO()) {
            this.onBallLost();
        }
    }

    onPlayerHitBrick(brick) {
        if (this.ball.type === brick.type) {
            this.player.power++;
            this.player.rush++;
            this.hud.powerUIComponent.update(this.player.power);
        } else {
            this.player.rush = 0;
        }
        this.ball.type = Ball.Type.NEUTRAL;
        this.hud.levelLifeUIComponent.update(this.bricks.count());
        this.hud.rushUIComponent.update(this.player.rush);
    }

    onPlayerJustDefended() {
        this.hud.justDefendUIComponent.show();
        this.paddle.justDefendStance();
        setTimeout(() => this.paddle.normalStance(), 100);
    }

    onPlayerReceiveNormalDamage() {
        this.player.receiveNormalDamage();
        this.paddle.damagedStance();
        setTimeout(() => this.paddle.normalStance(), 100);
        this.hud.playerLifeUIComponent.update(this.player.life);
    }

    update() {
        if (this.aButton.isDown) {
            this.ball.type = Ball.Type.A;
        }
        if (this.bButton.isDown) {
            this.ball.type = Ball.Type.B;
        }
        if (this.cButton.isDown) {
            this.ball.type = Ball.Type.C;
        }
        if (this.dButton.isDown) {
            this.ball.type = Ball.Type.D;
        }
        if (this.aButton.isDown || this.bButton.isDown || this.cButton.isDown || this.dButton.isDown) {
            this.paddle.release(this.ball);
        }
        if (this.leftDirection.isDown) {
            this.paddle.moveLeft();
        }
        if (this.rightDirection.isDown) {
            this.paddle.moveRight();
        }
        if (this.playerHasInputedJustDefend()) {
            this.player.justDefend();
        }
        this.paddle.update(this.ball);
        this.bricks.update(this.ball);
    }

    playerHasInputedJustDefend() {
        return this.downDirection.isDown && this.downDirection.duration < 100 && !this.paddle.ballOnPaddle;
    }

    set paddle(paddle) {
        this._paddle = paddle;
        this._paddle.onBallHitPaddle = this.onBallHitPlayer.bind(this);
    }

    get paddle() {
        return this._paddle;
    }

    set ball(ball) {
        this._ball = ball;
        this.ball.onOutOfBounds = this.onBallLost.bind(this);
    }

    get ball() {
        return this._ball;
    }

}

module.exports = GameEngine;
},{"./ball":2,"./bricks":4,"./controls":5,"./domain/player":6,"./hud":8}],8:[function(require,module,exports){
const LifeUIComponent = require('./hud/components/life-component');
const JustDefendUIComponent = require('./hud/components/just-defend-component');
const RushUIComponent = require('./hud/components/rush-component');
const PowerUIComponent = require('./hud/components/power-component');

class HUD {

    constructor(game) {
        this.playerLifeUIComponent = new LifeUIComponent(game);
        this.levelLifeUIComponent = new LifeUIComponent(game);
        this.justDefendUIComponent = new JustDefendUIComponent(game);
        this.rushUIComponent = new RushUIComponent(game);
        this.powerUIComponent = new PowerUIComponent(game);
    }

    create(player, bricks) {
        this.playerLifeUIComponent.create(10, 10, player.life);
        this.levelLifeUIComponent.create(200, 10, bricks.count());
        this.powerUIComponent.create(10, 200);
        this.justDefendUIComponent.create();
        this.rushUIComponent.create();
    }

}

module.exports = HUD;
},{"./hud/components/just-defend-component":9,"./hud/components/life-component":10,"./hud/components/power-component":11,"./hud/components/rush-component":12}],9:[function(require,module,exports){
class JustDefendUIComponent {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.component = this.game.add.text(10, 30, 'Just Defend !', {
            font: '20px Courrier',
            fill: '#FFFF00',
            align: 'left'
        });
        this.component.visible = false;
    }

    show() {
        this.component.visible = true;
        setTimeout(() => {
            this.component.visible = false;
        }, 1000);
    }

}
module.exports = JustDefendUIComponent;
},{}],10:[function(require,module,exports){
class LifeUIComponent {

    constructor(game) {
        this.game = game;
    }

    create(x, y, initialLife) {
        this.component = this.game.add.text(x, y, `life: ${initialLife}`, {
            font: '20px Courrier',
            fill: '#00FF00',
            align: 'left'
        });
    }

    update(life) {
        this.component.text = `life: ${life}`;
    }
}
module.exports = LifeUIComponent;
},{}],11:[function(require,module,exports){
class PowerUIComponent {

    constructor(game) {
        this.game = game;
    }

    create(x, y) {
        this.component = this.game.add.text(x, y, `power: 0`, {
            font: '10px Courrier',
            fill: '#00FF00',
            align: 'left'
        });
    }

    update(power) {
        this.component.text = `power: ${power}`;
    }
}
module.exports = PowerUIComponent;
},{}],12:[function(require,module,exports){
class RushUIComponent {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.component = this.game.add.text(10, 40, 'Rush', {
            font: '10px Courrier',
            fill: '#FF00FF',
            align: 'left'
        });
        this.component.visible = false;
    }

    update(rush) {
        this.component.text = `Rush ${rush}`;
        const visible = rush >= 2;
        if (visible) {
            this.component.visible = true;
            setTimeout(() => {
                this.component.visible = false;
            }, 1000);
        }
    }

}
module.exports = RushUIComponent;
},{}],13:[function(require,module,exports){
class Paddle {

    constructor(game) {
        this.game = game;
        this.ballOnPaddle = true;
        this.speed = 7;
    }

    create() {
        this.sprite = this.game.add.sprite(this.game.world.centerX, 200, 'sprites', 'paddle.png');
        this.sprite.anchor.setTo(0.5, 0.5);

        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.set(1);
        this.sprite.body.immovable = true;

        this.sprite.animations.add('just_defend', Phaser.Animation.generateFrameNames('just_defend/', 1, 1, '.png'));
        this.sprite.animations.add('damage', Phaser.Animation.generateFrameNames('damaged/', 1, 1, '.png'));
    }

    get x() {
        return this.sprite.x;
    }

    get body() {
        return this.sprite.body;
    }

    get y() {
        return this.sprite.y;
    }

    set x(x) {
        this.sprite.x = x;
    }

    set y(y) {
        this.sprite.y = y;
    }

    release(ball) {
        if (this.ballOnPaddle) {
            this.ballOnPaddle = false;
            ball.release();
        }
    }

    reset(ball) {
        this.ballOnPaddle = true;
        const x = this.sprite.body.x;
        const y = this.y - (ball.height * 1.3);
        ball.resetAt(x, y);
    }

    update(ball) {
        if (this.ballOnPaddle) {
            ball.setX(this.x - ball.width / 2);
        } else {
            this.game.physics.arcade.collide(this.sprite, ball.sprite, Paddle.reflect, this.onBallHitPaddle, this);
        }
    }

    static reflect(paddleSprite, ballSprite) {
        let diff = 0;
        if (ballSprite.x < paddleSprite.x) {
            //  Ball is on the left-hand side of the paddle
            diff = paddleSprite.x - ballSprite.x;
            ballSprite.body.velocity.x = (-8 * diff);
        } else if (ballSprite.x > paddleSprite.x) {
            //  Ball is on the right-hand side of the paddle
            diff = ballSprite.x - paddleSprite.x;
            ballSprite.body.velocity.x = (8 * diff);
        } else {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            ballSprite.body.velocity.x = 2 + Math.random() * 8;
        }
    }

    moveLeft() {
        if (this.canMoveLeft()) {
            this.x -= this.speed;
        }
    }

    canMoveLeft() {
        return (this.x - this.speed - (this.getWidth() / 2)) >= 0;
    }

    moveRight() {
        if (this.canMoveRight()) {
            this.x += this.speed;
        }
    }

    canMoveRight() {
        return (this.x + this.speed + (this.getWidth() / 2)) <= (this.game.width);
    }

    getWidth() {
        return this.sprite.body.width;
    }

    justDefendStance() {
        this.sprite.animations.play('just_defend');
    }

    damagedStance() {
        this.sprite.animations.play('damage');
    }

    normalStance() {
        this.sprite.frameName = 'paddle.png';
    }

}
module.exports = Paddle;
},{}],14:[function(require,module,exports){
const WIDTH = 320;
const HEIGHT = 224;

const BreakOutFighters = require('./breakout-fighters');
const breakOutFighters = new BreakOutFighters(WIDTH, HEIGHT);

const antialias = false;
const transparent = false;
new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'phaser-example', {
    preload: breakOutFighters.preload.bind(breakOutFighters),
    create: breakOutFighters.create.bind(breakOutFighters),
    update: breakOutFighters.update.bind(breakOutFighters),
}, transparent, antialias);
},{"./breakout-fighters":3}]},{},[14]);
