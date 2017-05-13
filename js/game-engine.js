const Player = require('./domain/player');
const Controls = require('./controls');
const Bricks = require('./bricks');
const HUD = require('./hud');

class GameEngine {
    constructor(game) {
        this.game = game;
        this.player = new Player();
        this.bricks = new Bricks(game);
        this.bricks.onBallHitBrick = this.onPlayerHitBrick.bind(this);
        this.hud = new HUD(game);
    }

    preload() {
        this.game.load.atlas('sprites', 'assets/sprites/sprite.png', 'assets/sprites/sprite.json');
        this.game.load.text('level_1', '../assets/levels/level_1/wall.data');
    }

    create() {
        this.game.stage.smoothed = false;

        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.game.physics.arcade.bounds = new Phaser.Rectangle(0, 20, this.game.world.width, this.game.world.height);
        this.game.physics.arcade.checkCollision.down = false;
        this.startButton = this.game.input.keyboard.addKey(Controls.buttons.START);
        this.leftDirection = this.game.input.keyboard.addKey(Controls.joystick.LEFT);
        this.rightDirection = this.game.input.keyboard.addKey(Controls.joystick.RIGHT);
        this.downDirection = this.game.input.keyboard.addKey(Controls.joystick.DOWN);

        const level1 = this.game.cache.getText('level_1');
        this.bricks.create();
        this.bricks.createWall(level1);

        this.hud.create(this.player, this.bricks);
    }

    onBallLost() {
        this.paddle.reset(this.ball);
        this.player.restoreFullLife();
        this.bricks.reset();
        this.hud.playerLifeUIComponent.update(this.player.life);
        this.hud.levelLifeUIComponent.update(this.bricks.count());
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

    onPlayerHitBrick() {
        this.hud.levelLifeUIComponent.update(this.bricks.count() - 1);
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
        this.hud.playerLifeUIComponent.update(this.player.life);
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
        this.bricks.update(this.ball);
    }

    playerHasInputedJustDefend() {
        return this.downDirection.isDown && this.downDirection.duration < 100 && !this.paddle.ballOnPaddle;
    }

    set paddle(paddle) {
        this._paddle = paddle;
        this._paddle.onBallHitPaddle = this.onBallHitPlayer.bind(this);
    }

    get paddle() {
        return this._paddle;
    }

    set ball(ball) {
        this._ball = ball;
        this.ball.onOutOfBounds = this.onBallLost.bind(this);
    }

    get ball() {
        return this._ball;
    }

}

module.exports = GameEngine;