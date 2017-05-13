const Player = require('./domain/player');
const Controls = require('./controls');

class GameEngine {
    constructor(game) {
        this.game = game;
        this.player = new Player();
    }

    preload() {
        this.game.load.atlas('sprites', 'assets/sprites/sprite.png', 'assets/sprites/sprite.json');
    }

    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.bounds = new Phaser.Rectangle(0, 20, this.game.world.width, this.game.world.height);
        this.game.physics.arcade.checkCollision.down = false;
        this.startButton = this.game.input.keyboard.addKey(Controls.buttons.START);
        this.leftDirection = this.game.input.keyboard.addKey(Controls.joystick.LEFT);
        this.rightDirection = this.game.input.keyboard.addKey(Controls.joystick.RIGHT);
        this.downDirection = this.game.input.keyboard.addKey(Controls.joystick.DOWN);
    }

    onBallLost() {
        this.paddle.reset(this.ball);
        this.player.restoreFullLife();
        this.hud.lifeUIComponent.update(this.player.life);
    }

    onBallHitPlayer() {
        if (this.player.justDefending) {
            this.onPlayerJustDefended();
        } else {
            this.onPlayerReceiveNormalDamage();
        }
        if (this.player.isKO()) {
            this.onBallLost();
        }
    }

    onPlayerJustDefended() {
        this.hud.justDefendUIComponent.show();
        this.paddle.justDefendStance();
        setTimeout(() => this.paddle.normalStance(), 100);
    }

    onPlayerReceiveNormalDamage() {
        this.player.receiveNormalDamage();
        this.paddle.damagedStance();
        setTimeout(() => this.paddle.normalStance(), 100);
        this.hud.lifeUIComponent.update(this.player.life);
    }

    update() {
        if (this.startButton.isDown) {
            this.paddle.release(this.ball);
        }
        if (this.leftDirection.isDown) {
            this.paddle.moveLeft();
        }
        if (this.rightDirection.isDown) {
            this.paddle.moveRight();
        }
        if (this.playerHasInputedJustDefend()) {
            this.player.justDefend();
        }
        this.paddle.update(this.ball);
    }

    playerHasInputedJustDefend() {
        return this.downDirection.isDown && this.downDirection.duration < 100 && !this.paddle.ballOnPaddle;
    }

}

module.exports = GameEngine;