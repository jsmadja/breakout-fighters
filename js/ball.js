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