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
        this.sprite.animations.add('maxmode', Phaser.Animation.generateFrameNames('maxmode/paddle_maxmode_', 1, 1, '.png'));
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

    activateMaxMode() {
        this.sprite.animations.play('maxmode');
    }

    deactivateMaxMode() {
        this.normalStance();
    }

}
module.exports = Paddle;