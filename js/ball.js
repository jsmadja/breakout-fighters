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