class PowerUIComponent {

    constructor(game) {
        this.game = game;
    }

    preload() {
        this.game.load.image('power', 'assets/sprites/power.png');
    }

    create(x, y) {
        this.component = this.game.add.text(x, y, 'POW', {
            font: '10px Courrier',
            fill: '#00FF00',
        });
        this.sprite = this.game.add.sprite(x + 30, y, 'power');
        this.sprite.crop(new Phaser.Rectangle(0, 0, 0, 10));
    }

    update(power) {
        this.sprite.cropRect.width = power;
        this.sprite.updateCrop();
    }
}
module.exports = PowerUIComponent;