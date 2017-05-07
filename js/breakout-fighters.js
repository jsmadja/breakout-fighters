class BreakOutFighters {

    /*
     let ball;
     let paddle;
     let bricks;
     let hud;
     let gameEngine;
     */

    constructor(width, height) {
        this.width = width;
        this.height = height;
    }

    preload(game) {
        game.load.atlas('breakout', 'assets/games/breakout/breakout.png', 'assets/games/breakout/breakout.json');
        game.load.image('starfield', 'assets/misc/starfield.jpg');
    }

    create(game) {
        game.physics.startSystem(Phaser.Physics.ARCADE);
        game.add.tileSprite(0, 0, this.width, this.height, 'starfield');
        this.gameEngine = new GameEngine();
        this.bricks = new Bricks(game);
        this.paddle = new Paddle(game);
        this.ball = new Ball(game, game.world.centerX, this.paddle.y - 16, this.onBallLost.bind(this));
        this.hud = new HUD(game);

        //  We check bounds collisions against all walls other than the bottom one
        game.physics.arcade.checkCollision.down = false;
        game.input.onDown.add(this.releaseBall, this);
    }

    update(game) {
        this.paddle.update(game);
        this.ball.update(this.gameEngine.ballOnPaddle, this.paddle, this.bricks, this.ballHitBrick.bind(this));
    }

    releaseBall() {
        if (this.gameEngine.ballOnPaddle) {
            this.gameEngine.ballOnPaddle = false;
            this.ball.release();
            this.hud.hideIntroText();
        }
    }

    onBallLost() {
        this.gameEngine.onBallLost();
        this.hud.setLives(this.gameEngine.lives);

        if (this.gameEngine.isOver()) {
            this.gameOver();
        } else {
            this.gameEngine.ballOnPaddle = true;
            this.ball.reset(this.paddle.body.x + 16, this.paddle.y - 16);
        }
    }

    gameOver() {
        this.ball.destroy();
        this.hud.setIntroText('Game Over!');
        this.hud.showIntroText();
    }

    ballHitBrick(_ball, brickSprite) {

        brickSprite.kill();

        this.gameEngine.onBallHitBrick();

        this.hud.setScore(this.gameEngine.score);

        //  Are they any bricks left?
        if (this.bricks.isEmpty()) {
            //  New level starts
            this.gameEngine.onBricksAreEmpty();
            this.hud.setScore(this.gameEngine.score);
            this.hud.setIntroText('- Next Level -');

            //  Let's move the ball back to the paddle
            this.gameEngine.ballOnPaddle = true;
            this.ball.reset(this.paddle.x + 16, this.paddle.y - 16);

            //  And bring the bricks back from the dead :)
            this.bricks.revive();
        }

    }


}