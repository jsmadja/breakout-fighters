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

    collideWithPaddle(paddle) {
        this.game.physics.arcade.collide(this.sprite, paddle, Ball.ballHitPaddle, null, this);
    }

    collideWithBrick(bricks, ballHitBrick) {
        this.game.physics.arcade.collide(this.sprite, bricks, ballHitBrick, null, this);
    }

    setX(x) {
        this.sprite.body.x = x;
    }

    release() {
        this.sprite.body.velocity.y = -300;
        this.sprite.body.velocity.x = -75;
        this.sprite.animations.play('spin');
    }

    resetOnPaddle(paddle) {
        const x = paddle.body.x + 16;
        const y = paddle.y - 10;

        this.sprite.body.velocity.set(0);
        this.sprite.reset(x, y);
        this.sprite.animations.stop();
    }

    destroy() {
        this.sprite.body.velocity.setTo(0, 0);
    }

    update(ballOnPaddle, paddle) {
        if (ballOnPaddle) {
            this.setX(paddle.x);
        } else {
            this.collideWithPaddle(paddle.sprite);
        }
    }

    static ballHitPaddle(ballSprite, paddleSprite) {
        let diff = 0;
        if (ballSprite.x < paddleSprite.x) {
            //  Ball is on the left-hand side of the paddle
            diff = paddleSprite.x - ballSprite.x;
            ballSprite.body.velocity.x = (-10 * diff);
        }
        else if (ballSprite.x > paddleSprite.x) {
            //  Ball is on the right-hand side of the paddle
            diff = ballSprite.x - paddleSprite.x;
            ballSprite.body.velocity.x = (10 * diff);
        }
        else {
            //  Ball is perfectly in the middle
            //  Add a little random X to stop it bouncing straight up!
            ballSprite.body.velocity.x = 2 + Math.random() * 8;
        }
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

        this.ball = new Ball(game, this.gameEngine.onBallLost.bind(this));

        this.paddle = new Paddle(game);

        this.gameEngine.ball = this.ball;
        this.gameEngine.paddle = this.paddle;
    }

    create() {
        this.gameEngine.create();
        this.background.create(this.width, this.height);
        this.paddle.create();
        this.ball.create();
        this.ball.resetOnPaddle(this.paddle);
    }

    update() {
        this.gameEngine.update();
    }

}

module.exports = BreakOutFighters;
},{"./background":1,"./ball":2,"./game-engine":4,"./hud":5,"./paddle":6}],4:[function(require,module,exports){
class GameEngine {
    constructor(game) {
        this.game = game;
        this.ballOnPaddle = true;
    }

    preload() {
        this.game.load.atlas('sprites', 'assets/sprites/sprite.png', 'assets/sprites/sprite.json');
    }

    create() {
        //  We check bounds collisions against all walls other than the bottom one
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.bounds = new Phaser.Rectangle(0, 20, this.game.world.width, this.game.world.height);
        this.game.physics.arcade.checkCollision.down = false;
        this.game.input.onDown.add(this.releaseBall, this);
    }

    releaseBall() {
        if (this.ballOnPaddle) {
            this.ballOnPaddle = false;
            this.ball.release();
        }
    }

    onBallLost() {
        this.ballOnPaddle = true;
        this.ball.resetOnPaddle(this.paddle);
    }

    update() {
        this.paddle.update();
        this.ball.update(this.ballOnPaddle, this.paddle);
    }

}

module.exports = GameEngine;
},{}],5:[function(require,module,exports){
class HUD {

    constructor(game) {
    }

}

module.exports = HUD;
},{}],6:[function(require,module,exports){
class Paddle {

    constructor(game) {
        this.game = game;
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

    update() {
        this.x = this.game.input.x;
        if (this.x < 24) {
            this.x = 24;
        } else if (this.x > this.game.width - 24) {
            this.x = this.game.width - 24;
        }

    }
}
module.exports = Paddle;
},{}],7:[function(require,module,exports){
const WIDTH = 320;
const HEIGHT = 224;

const BreakOutFighters = require('./breakout-fighters');
const breakOutFighters = new BreakOutFighters(WIDTH, HEIGHT);

new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'phaser-example', {
    preload: breakOutFighters.preload.bind(breakOutFighters),
    create: breakOutFighters.create.bind(breakOutFighters),
    update: breakOutFighters.update.bind(breakOutFighters),
});
},{"./breakout-fighters":3}]},{},[7]);
