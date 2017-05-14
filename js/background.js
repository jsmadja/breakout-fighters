class Background {

    constructor(game) {
        this.game = game;
    }

    preload() {
        this.game.load.image('grid', 'assets/back/grid.png');
    }

    create(width, height) {
        //this.game.add.tileSprite(0, 0, width, height, 'grid');
    }

}

module.exports = Background;