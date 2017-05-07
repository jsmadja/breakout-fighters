class HUD {

    constructor(game) {
        this.scoreText = game.add.text(0, 214, 'score: 0', { font: "10px Arial", fill: "#ffffff", align: "left" });
        this.livesText = game.add.text(285, 214, 'lives: 3', { font: "10px Arial", fill: "#ffffff", align: "left" });
        this.introText = game.add.text(game.world.centerX, game.world.centerY, '- click to start -', {
            font: "20px Arial",
            fill: "#ffffff",
            align: "center"
        });
        this.introText.anchor.setTo(0.5, 0.5);
    }

    hideIntroText() {
        this.introText.visible = false;
    }
    setLives(lives) {
        this.livesText.text = 'lives: ' + lives;
    }
    setIntroText(introText) {
        this.introText.text = introText;
    }
    showIntroText() {
        this.introText.visible = true;
    }
    setScore(score) {
        this.scoreText.text = 'score: ' + score;
    }

}