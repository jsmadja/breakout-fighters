const GameEngine = require('./game-engine');
const Paddle = require('./paddle');
const Ball = require('./ball');
const HUD = require('./hud');
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

        this.hud = new HUD(game);

        this.ball = new Ball(game, this.gameEngine.onBallLost.bind(this.gameEngine));

        this.paddle = new Paddle(game);

        this.gameEngine.ball = this.ball;
        this.gameEngine.paddle = this.paddle;
        this.gameEngine.hud = this.hud;
    }

    create() {
        this.gameEngine.create();
        this.background.create(this.width, this.height);
        this.paddle.create();
        this.ball.create();
        this.paddle.reset(this.ball);
        this.hud.create();

        this.paddle.onBallHitPaddle = this.gameEngine.onBallHitPlayer.bind(this.gameEngine);
    }

    update() {
        this.gameEngine.update();
    }

}

module.exports = BreakOutFighters;