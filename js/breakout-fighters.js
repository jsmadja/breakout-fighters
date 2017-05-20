const GameEngine = require('./game-engine');
const Paddle = require('./paddle');
const Ball = require('./ball');
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

        this.ball = new Ball(game);
        this.paddle = new Paddle(game);

        this.gameEngine.ball = this.ball;
        this.gameEngine.paddle = this.paddle;
    }

    create(game) {
        this.background.create(this.width, this.height);
        this.paddle.create();
        this.ball.create();
        this.gameEngine.create();
        this.paddle.reset(this.ball);

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