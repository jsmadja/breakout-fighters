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