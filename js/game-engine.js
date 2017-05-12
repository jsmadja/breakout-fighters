class GameEngine {
    constructor(game) {
        this.game = game;
        this.ballOnPaddle = true;
    }

    preload() {
        this.game.load.atlas('sprites', 'assets/sprites/sprite.png', 'assets/sprites/sprite.json');
    }

    create() {
        //  We check bounds collisions against all walls other than the bottom one
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.bounds = new Phaser.Rectangle(0, 20, this.game.world.width, this.game.world.height);
        this.game.physics.arcade.checkCollision.down = false;
        this.game.input.onDown.add(this.releaseBall, this);
    }

    releaseBall() {
        if (this.ballOnPaddle) {
            this.ballOnPaddle = false;
            this.ball.release();
        }
    }

    onBallLost() {
        this.ballOnPaddle = true;
        this.ball.resetOnPaddle(this.paddle);
    }

    update() {
        this.paddle.update();
        this.ball.update(this.ballOnPaddle, this.paddle);
    }

}

module.exports = GameEngine;