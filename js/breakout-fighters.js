const GameEngine = require('./game-engine');
const Paddle = require('./domain/paddle');
const Balls = require('./domain/balls');
const Background = require('./background');

class BreakOutFighters {

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    preload(game) {
        this.gameEngine = new GameEngine(game);
        this.gameEngine.preload();

        this.background = new Background(game);
        this.background.preload();

        this.balls = new Balls(game);
        this.paddle = new Paddle(game);

        this.gameEngine.balls = this.balls;
        this.gameEngine.paddle = this.paddle;
    }

    create(game) {
        this.background.create(this.width, this.height);
        this.paddle.create();
        this.balls.create();
        this.gameEngine.create();
        this.paddle.reset(this.balls);

        game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        game.input.onDown.add(() => this.gofull(game), this);
    }

    gofull(game) {

        if (game.scale.isFullScreen) {
            game.scale.stopFullScreen();
        }
        else {
            game.scale.startFullScreen(false);
        }

    }

    update() {
        this.gameEngine.update();
    }

}

module.exports = BreakOutFighters;