const uuidV4 = require('uuid/v4');

const BALL_SPEED = 0.5;

class Ball {

    constructor(game, onOutOfBounds) {
        this.game = game;
        this.onOutOfBounds = onOutOfBounds;
    }

    create() {
        this.sprite = this.game.add.sprite(0, 0, 'sprites', 'ball.png');
        this.sprite.id = uuidV4();
        this.sprite.anchor.set(0.5);
        this.sprite.checkWorldBounds = true;
        this.type = Ball.Type.NEUTRAL;

        this.game.physics.enable(this.sprite, Phaser.Physics.ARCADE);

        this.offset = new Phaser.Point(2, 2);
        this.shadow = this.game.add.sprite(0, 0, 'sprites', 'ball.png');
        this.shadow.anchor.set(0.5);
        this.shadow.tint = 0x000000;
        this.shadow.alpha = 0.6;

        this.sprite.body.collideWorldBounds = true;
        this.sprite.body.bounce.set(1);
        this.sprite.events.onOutOfBounds.add(this.onOutOfBounds, this);

        const group = this.game.add.group();
        group.add(this.shadow);
        group.add(this.sprite);
    }

    update() {
        this.shadow.x = this.sprite.x + this.offset.x;
        this.shadow.y = this.sprite.y + this.offset.y;
    }

    setX(x) {
        this.sprite.body.x = x;
    }

    release() {
        this.sprite.body.velocity.y = -300 * BALL_SPEED;
        this.sprite.body.velocity.x = -75 * BALL_SPEED;
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
            MAXMODE: 'maxmode',
        };
    }

    activateMaxMode() {
        this.type = Ball.Type.MAXMODE;
    }

    deactivateMaxMode() {
        this.type = Ball.Type.NEUTRAL;
    }
}

module.exports = Ball;