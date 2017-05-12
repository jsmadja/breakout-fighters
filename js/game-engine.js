const Player = require('./domain/player');

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
        this.game.input.onDown.add(() => this.paddle.release(this.ball), this);
    }

    onBallLost() {
        this.paddle.reset(this.ball);
        this.player.restoreFullLife();
        this.hud.lifeUIComponent.update(this.player.life);
    }

    onBallHitPlayer() {
        this.onPlayerReceiveNormalDamage();
        if(this.player.isKO()) {
            this.onBallLost();
        }
    }

    onPlayerReceiveNormalDamage() {
        this.player.receiveNormalDamage();
        this.hud.lifeUIComponent.update(this.player.life);
    }

    update() {
        this.paddle.update(this.ball);
    }

}

module.exports = GameEngine;