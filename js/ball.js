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