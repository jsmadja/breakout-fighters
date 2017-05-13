const SCALE_FACTOR = 1.3;

class LifeUIComponent {

    constructor(game) {
        this.game = game;
    }

    preload() {
        this.game.load.image('life', 'assets/sprites/life.png');
    }

    create(x, y, initialLife, invert) {
        this.sprite = this.game.add.sprite(x, y, 'life');
        if (invert) {
            this.sprite.scale.x = SCALE_FACTOR;
        } else {
            this.sprite.x += this.sprite.width * SCALE_FACTOR;
            this.sprite.scale.x = -SCALE_FACTOR;
        }
        this.sprite.crop(new Phaser.Rectangle(0, 0, initialLife, 10));
    }

    update(life) {
        this.sprite.cropRect.width = life;
        this.sprite.updateCrop();
    }
}
module.exports = LifeUIComponent;