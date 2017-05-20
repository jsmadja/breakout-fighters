class PowerUIComponent {

    constructor(game) {
        this.game = game;
    }

    create(x, y) {
        this.component = this.game.add.text(x, y, 'POW', {
            font: '10px Courrier',
            fill: '#00FF00',
        });
        this.sprite = this.game.add.sprite(x + 30, y, 'sprites', 'power.png');
        this.sprite.crop(new Phaser.Rectangle(0, 0, 0, 10));
        this.sprite.animations.add('maxmode', Phaser.Animation.generateFrameNames('maxmode/', 1, 1, '.png'));
    }

    update(power) {
        this.sprite.cropRect.width = power;
        this.sprite.updateCrop();
    }

    activateMaxMode() {
        this.sprite.animations.play('maxmode');
    }

    deactivateMaxMode() {
        this.sprite.animations.stop('maxmode');
    }
}
module.exports = PowerUIComponent;