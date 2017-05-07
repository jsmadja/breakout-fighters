class GameEngine {
    constructor() {
        this.lives = 3;
        this.score = 0;
        this.ballOnPaddle = true;
    }

    onBallLost() {
        this.lives--;
    }

    isOver() {
        return this.lives === 0;
    }

    onBallHitBrick() {
        this.score += 10;
    }

    onBricksAreEmpty() {
        this.score += 1000;
    }
}