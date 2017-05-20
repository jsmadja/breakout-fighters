class Background {

    constructor(game) {
        this.game = game;
    }

    preload() {
        this.game.load.image('background', 'assets/back/stone.png');
    }

    create(width, height) {
        this.game.add.tileSprite(0, 0, width, height, 'background');
    }

}

module.exports = Background;