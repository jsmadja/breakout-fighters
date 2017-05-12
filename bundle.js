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
},{"./background":1,"./ball":2,"./game-engine":5,"./hud":6,"./paddle":8}],4:[function(require,module,exports){
const MAX_LIFE = 100;

class Player {
    constructor() {
        this.restoreFullLife();
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
}

module.exports = Player;
},{}],5:[function(require,module,exports){
const Player = require('./domain/player');

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
        this.game.input.onDown.add(() => this.paddle.release(this.ball), this);
    }

    onBallLost() {
        this.paddle.reset(this.ball);
        this.player.restoreFullLife();
        this.hud.lifeUIComponent.update(this.player.life);
    }

    onBallHitPlayer() {
        this.onPlayerReceiveNormalDamage();
        if(this.player.isKO()) {
            this.onBallLost();
        }
    }

    onPlayerReceiveNormalDamage() {
        this.player.receiveNormalDamage();
        this.hud.lifeUIComponent.update(this.player.life);
    }

    update() {
        this.paddle.update(this.ball);
    }

}

module.exports = GameEngine;
},{"./domain/player":4}],6:[function(require,module,exports){
const LifeUIComponent = require('./hud/components/life-ui-component');

class HUD {

    constructor(game) {
        this.lifeUIComponent = new LifeUIComponent(game);
    }

    create() {
        this.lifeUIComponent.create();
    }

}

module.exports = HUD;
},{"./hud/components/life-ui-component":7}],7:[function(require,module,exports){
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
},{}],8:[function(require,module,exports){
class Paddle {

    constructor(game) {
        this.game = game;
        this.ballOnPaddle = true;
    }

    create() {
        this.sprite = this.game.add.sprite(this.game.world.centerX, 200, 'sprites', 'paddle.png');
        this.sprite.anchor.setTo(0.5, 0.5);

        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.set(1);
        this.sprite.body.immovable = true;
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
        this.x = this.game.input.x;
        if (this.x < 24) {
            this.x = 24;
        } else if (this.x > this.game.width - 24) {
            this.x = this.game.width - 24;
        }
        if (this.ballOnPaddle) {
            ball.setX(this.x);
        } else {
            this.game.physics.arcade.collide(this.sprite, ball.sprite, Paddle.reflect, this.onBallHitPaddle, this);
        }
    }

    static reflect(ballSprite, paddleSprite) {
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

}
module.exports = Paddle;
},{}],9:[function(require,module,exports){
const WIDTH = 320;
const HEIGHT = 224;

const BreakOutFighters = require('./breakout-fighters');
const breakOutFighters = new BreakOutFighters(WIDTH, HEIGHT);

new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'phaser-example', {
    preload: breakOutFighters.preload.bind(breakOutFighters),
    create: breakOutFighters.create.bind(breakOutFighters),
    update: breakOutFighters.update.bind(breakOutFighters),
});
},{"./breakout-fighters":3}]},{},[9]);
