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