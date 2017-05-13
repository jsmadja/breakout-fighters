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
class Ball {

    constructor(game, onOutOfBounds) {
        this.game = game;
        this.onOutOfBounds = onOutOfBounds;
    }

    create() {
        this.sprite = this.game.add.sprite(0, 0, 'sprites', 'ball.png');
        this.sprite.anchor.set(0.5);
        this.sprite.checkWorldBounds = true;

        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.set(1);
        this.sprite.events.onOutOfBounds.add(this.onOutOfBounds, this);
    }

    setX(x) {
        this.sprite.body.x = x;
    }

    release() {
        this.sprite.body.velocity.y = -300;
        this.sprite.body.velocity.x = -75;
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
}

module.exports = Ball;
},{}],3:[function(require,module,exports){
const GameEngine = require('./game-engine');
const Paddle = require('./paddle');
const Ball = require('./ball');
const HUD = require('./hud');
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

        this.hud = new HUD(game);

        this.ball = new Ball(game, this.gameEngine.onBallLost.bind(this.gameEngine));

        this.paddle = new Paddle(game);

        this.gameEngine.ball = this.ball;
        this.gameEngine.paddle = this.paddle;
        this.gameEngine.hud = this.hud;
    }

    create() {
        this.gameEngine.create();
        this.background.create(this.width, this.height);
        this.paddle.create();
        this.ball.create();
        this.paddle.reset(this.ball);
        this.hud.create();

        this.paddle.onBallHitPaddle = this.gameEngine.onBallHitPlayer.bind(this.gameEngine);
    }

    update() {
        this.gameEngine.update();
    }

}

module.exports = BreakOutFighters;
},{"./background":1,"./ball":2,"./game-engine":6,"./hud":7,"./paddle":10}],4:[function(require,module,exports){
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
},{}],5:[function(require,module,exports){
const MAX_LIFE = 100;
const JUST_DEFEND_TIMING = 200;

class Player {
    constructor() {
        this.restoreFullLife();
        this.justDefending = false;
    }

    receiveNormalDamage() {
        this.life -= 10;
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
},{}],6:[function(require,module,exports){
const Player = require('./domain/player');
const Controls = require('./controls');

class GameEngine {
    constructor(game) {
        this.game = game;
        this.player = new Player();
    }

    preload() {
        this.game.load.atlas('sprites', 'assets/sprites/sprite.png', 'assets/sprites/sprite.json');
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.bounds = new Phaser.Rectangle(0, 20, this.game.world.width, this.game.world.height);
        this.game.physics.arcade.checkCollision.down = false;
        this.startButton = this.game.input.keyboard.addKey(Controls.buttons.START);
        this.leftDirection = this.game.input.keyboard.addKey(Controls.joystick.LEFT);
        this.rightDirection = this.game.input.keyboard.addKey(Controls.joystick.RIGHT);
        this.downDirection = this.game.input.keyboard.addKey(Controls.joystick.DOWN);
    }

    onBallLost() {
        this.paddle.reset(this.ball);
        this.player.restoreFullLife();
        this.hud.lifeUIComponent.update(this.player.life);
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

    onPlayerJustDefended() {
        this.hud.justDefendUIComponent.show();
        this.paddle.justDefendStance();
        setTimeout(() => this.paddle.normalStance(), 100);
    }

    onPlayerReceiveNormalDamage() {
        this.player.receiveNormalDamage();
        this.paddle.damagedStance();
        setTimeout(() => this.paddle.normalStance(), 100);
        this.hud.lifeUIComponent.update(this.player.life);
    }

    update() {
        if (this.startButton.isDown) {
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
    }

    playerHasInputedJustDefend() {
        return this.downDirection.isDown && this.downDirection.duration < 100 && !this.paddle.ballOnPaddle;
    }

}

module.exports = GameEngine;
},{"./controls":4,"./domain/player":5}],7:[function(require,module,exports){
const LifeUIComponent = require('./hud/components/life-ui-component');
const JustDefendUIComponent = require('./hud/components/just-defend-component');

class HUD {

    constructor(game) {
        this.lifeUIComponent = new LifeUIComponent(game);
        this.justDefendUIComponent = new JustDefendUIComponent(game);
    }

    create() {
        this.lifeUIComponent.create();
        this.justDefendUIComponent.create();
    }

}

module.exports = HUD;
},{"./hud/components/just-defend-component":8,"./hud/components/life-ui-component":9}],8:[function(require,module,exports){
class JustDefendUIComponent {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.component = this.game.add.text(10, 60, 'Just Defend !', {
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
},{}],9:[function(require,module,exports){
class LifeUIComponent {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.component = this.game.add.text(10, 10, 'life: 100', { font: '20px Courrier', fill: '#00FF00', align: 'left' });
    }

    update(life) {
        this.component.text = `life: ${life}`;
    }
}
module.exports = LifeUIComponent;
},{}],10:[function(require,module,exports){
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
        const x = this.body.x + 16;
        const y = this.y - 10;
        ball.resetAt(x, y);
    }

    update(ball) {
        if (this.ballOnPaddle) {
            ball.setX(this.x);
        } else {
            this.game.physics.arcade.collide(this.sprite, ball.sprite, Paddle.reflect, this.onBallHitPaddle, this);
        }
    }

    static reflect(paddleSprite, ballSprite) {
        let diff = 0;
        if (ballSprite.x < paddleSprite.x) {
            //  Ball is on the left-hand side of the paddle
            diff = paddleSprite.x - ballSprite.x;
            ballSprite.body.velocity.x = (-10 * diff);
        } else if (ballSprite.x > paddleSprite.x) {
            //  Ball is on the right-hand side of the paddle
            diff = ballSprite.x - paddleSprite.x;
            ballSprite.body.velocity.x = (10 * diff);
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
},{}],11:[function(require,module,exports){
const WIDTH = 320;
const HEIGHT = 224;

const BreakOutFighters = require('./breakout-fighters');
const breakOutFighters = new BreakOutFighters(WIDTH, HEIGHT);

new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'phaser-example', {
    preload: breakOutFighters.preload.bind(breakOutFighters),
    create: breakOutFighters.create.bind(breakOutFighters),
    update: breakOutFighters.update.bind(breakOutFighters),
});
},{"./breakout-fighters":3}]},{},[11]);
