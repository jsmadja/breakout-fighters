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