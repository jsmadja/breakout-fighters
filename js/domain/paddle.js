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

        this.offset = new Phaser.Point(2, 2);
        this.shadow = this.game.add.sprite(this.game.world.centerX, 200, 'sprites', 'paddle.png');
        this.shadow.anchor.set(0.5);
        this.shadow.tint = 0x000000;
        this.shadow.alpha = 0.6;

        const group = this.game.add.group();
        group.add(this.shadow);
        group.add(this.sprite);
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

    release(balls) {
        if (this.ballOnPaddle) {
            this.ballOnPaddle = false;
            balls.release();
        }
    }

    reset(balls) {
        this.ballOnPaddle = true;
        const x = this.sprite.body.x;
        const y = this.y - (balls.height * 1.3);
        balls.resetAt(x, y);
    }

    update(balls) {
        if (this.ballOnPaddle) {
            balls.setX(this.x - balls.width / 2);
        } else {
            balls.balls.forEach(ball => {
                return this.game.physics.arcade.collide(this.sprite, ball.sprite, Paddle.reflect, this.onBallHitPaddle, this);
            });
        }
        this.shadow.x = this.sprite.x + this.offset.x;
        this.shadow.y = this.sprite.y + this.offset.y;
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