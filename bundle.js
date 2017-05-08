(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
class Ball {

    constructor(game, x, y, ballLost) {
        this.game = game;
        this.sprite = game.add.sprite(x, y, 'breakout', 'ball_1.png');
        this.sprite.anchor.set(0.5);
        this.sprite.checkWorldBounds = true;

        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.set(1);
        this.sprite.animations.add('spin', ['ball_1.png', 'ball_2.png', 'ball_3.png', 'ball_4.png', 'ball_5.png'], 50, true, false);
        this.sprite.events.onOutOfBounds.add(ballLost, this);
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

    reset(x, y) {
        this.sprite.body.velocity.set(0);
        this.sprite.reset(x, y);
        this.sprite.animations.stop();
    }

    destroy() {
        this.sprite.body.velocity.setTo(0, 0);
    }

    update(ballOnPaddle, paddle, bricks, ballHitBrick) {
        if (ballOnPaddle) {
            this.setX(paddle.x);
        } else {
            this.collideWithPaddle(paddle.sprite);
            this.collideWithBrick(bricks.group, ballHitBrick);
        }
    }

    static ballHitPaddle(ballSprite, paddleSprite) {
        this.game.block.play();
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
},{}],2:[function(require,module,exports){
const GameEngine = require('./game-engine');
const Bricks = require('./bricks');
const Paddle = require('./paddle');
const Ball = require('./ball');
const HUD = require('./hud');

class BreakOutFighters {

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    preload(game) {
        game.load.atlas('breakout', 'assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');
        game.load.image('starfield', 'assets/back/garou_special.png');

        // audio
        game.load.audio('mai', ['assets/audio/musics/mai.mp3']);
        game.load.audio('block', ['assets/audio/sounds/block.wav']);
        game.load.audio('hit', ['assets/audio/sounds/hit.wav']);
        game.load.audio('round1_fight', ['assets/audio/sounds/round1_fight.wav']);
    }

    create(game) {
        this.game = game;

        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.tileSprite(0, 0, this.width, this.height, 'starfield');
        this.gameEngine = new GameEngine();
        this.bricks = new Bricks(game);
        this.paddle = new Paddle(game);
        this.ball = new Ball(game, game.world.centerX, this.paddle.y - 16, this.onBallLost.bind(this));
        this.hud = new HUD(game);

        //  We check bounds collisions against all walls other than the bottom one
        game.physics.arcade.checkCollision.down = false;
        game.input.onDown.add(this.releaseBall, this);

        this.music = game.add.audio('mai');
        game.block = game.add.audio('block');
        game.hit = game.add.audio('hit');
        game.round1_fight = game.add.audio('round1_fight');
        this.game.round1_fight.play();
    }

    update(game) {
        this.paddle.update(game);
        this.ball.update(this.gameEngine.ballOnPaddle, this.paddle, this.bricks, this.ballHitBrick.bind(this));
    }

    releaseBall() {
        if (this.gameEngine.ballOnPaddle) {
            this.music.play();
            this.gameEngine.ballOnPaddle = false;
            this.ball.release();
            this.hud.hideIntroText();
        }
    }

    onBallLost() {
        this.gameEngine.onBallLost();
        this.hud.setLives(this.gameEngine.lives);

        if (this.gameEngine.isOver()) {
            this.gameOver();
        } else {
            this.gameEngine.ballOnPaddle = true;
            this.ball.reset(this.paddle.body.x + 16, this.paddle.y - 16);
        }
    }

    gameOver() {
        this.ball.destroy();
        this.hud.setIntroText('Game Over!');
        this.hud.showIntroText();
    }

    ballHitBrick(_ball, brickSprite) {

        this.game.hit.play();
        brickSprite.kill();

        this.gameEngine.onBallHitBrick();

        this.hud.setScore(this.gameEngine.score);

        //  Are they any bricks left?
        if (this.bricks.isEmpty()) {
            //  New level starts
            this.gameEngine.onBricksAreEmpty();
            this.hud.setScore(this.gameEngine.score);
            this.hud.setIntroText('- Next Level -');

            //  Let's move the ball back to the paddle
            this.gameEngine.ballOnPaddle = true;
            this.ball.reset(this.paddle.x + 16, this.paddle.y - 16);

            //  And bring the bricks back from the dead :)
            this.bricks.revive();
        }

    }

}

module.exports = BreakOutFighters;
},{"./ball":1,"./bricks":3,"./game-engine":4,"./hud":5,"./paddle":7}],3:[function(require,module,exports){
const brickWidth = 30;
const brickHeight = 16;
const marginLeft = (320 - (8 * brickWidth)) / 2;
const marginTop = 40;
const maxRows = 2;
const maxColumns = 8;

class Brick {
    constructor(group, x, y, row) {
        const brick = group.create(x, y, 'breakout', 'brick_' + (row + 1) + '_1.png');
        brick.body.bounce.set(1);
        brick.body.immovable = true;
    }
}

class Bricks {

    constructor(game) {
        this.group = game.add.group();
        this.group.enableBody = true;
        this.group.physicsBodyType = Phaser.Physics.ARCADE;
        this.createBricks();
    }

    createBricks() {
        for (let row = 0; row < maxRows; row++) {
            for (let column = 0; column < maxColumns; column++) {
                const x = marginLeft + (column * brickWidth);
                const y = marginTop + (row * brickHeight);
                new Brick(this.group, x, y, row);
            }
        }
    }

    revive() {
        this.group.callAll('revive');
    }

    isEmpty() {
        return this.group.countLiving() === 0;
    }

}

module.exports = Bricks;
},{}],4:[function(require,module,exports){
class GameEngine {
    constructor() {
        this.lives = 3;
        this.score = 0;
        this.ballOnPaddle = true;
    }

    onBallLost() {
        this.lives--;
    }

    isOver() {
        return this.lives === 0;
    }

    onBallHitBrick() {
        this.score += 10;
    }

    onBricksAreEmpty() {
        this.score += 1000;
    }
}

module.exports = GameEngine;
},{}],5:[function(require,module,exports){
class HUD {

    constructor(game) {
        this.scoreText = game.add.text(0, 214, 'score: 0', { font: "10px Arial", fill: "#ffffff", align: "left" });
        this.livesText = game.add.text(285, 214, 'lives: 3', { font: "10px Arial", fill: "#ffffff", align: "left" });
        this.introText = game.add.text(game.world.centerX, game.world.centerY, '- click to start -', {
            font: "20px Arial",
            fill: "#ffffff",
            align: "center"
        });
        this.introText.anchor.setTo(0.5, 0.5);

        this.scoreText.visible = false;
        this.livesText.visible = false;
    }

    hideIntroText() {
        this.introText.visible = false;
    }
    setLives(lives) {
        this.livesText.text = 'lives: ' + lives;
    }
    setIntroText(introText) {
        this.introText.text = introText;
    }
    showIntroText() {
        this.introText.visible = true;
    }
    setScore(score) {
        this.scoreText.text = 'score: ' + score;
    }

}

module.exports = HUD;
},{}],6:[function(require,module,exports){
const WIDTH = 320;
const HEIGHT = 224;

const BreakOutFighters = require('./breakout-fighters');
const breakOutFighters = new BreakOutFighters(WIDTH, HEIGHT);

new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'phaser-example', {
    preload: breakOutFighters.preload,
    create: breakOutFighters.create.bind(breakOutFighters),
    update: breakOutFighters.update.bind(breakOutFighters),
});
},{"./breakout-fighters":2}],7:[function(require,module,exports){
class Paddle {

    constructor(game) {
        this.sprite = game.add.sprite(game.world.centerX, 200, 'breakout', 'paddle_big.png');
        this.sprite.anchor.setTo(0.5, 0.5);

        game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

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

    update(game) {
        this.x = game.input.x;
        if (this.x < 24) {
            this.x = 24;
        } else if (this.x > game.width - 24) {
            this.x = game.width - 24;
        }

    }
}
module.exports = Paddle;
},{}]},{},[6]);
