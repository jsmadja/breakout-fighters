const Player = require('./domain/player');
const Controls = require('./controls');
const Bricks = require('./bricks');
const HUD = require('./hud');
const Ball = require('./ball');

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
        this.bindControls();

        const level1 = this.game.cache.getText('level_1');
        this.bricks.create();
        this.bricks.createWall(level1);

        this.hud.create(this.player, this.bricks);
    }

    bindControls() {
        this.aButton = this.game.input.keyboard.addKey(Controls.buttons.A);
        this.bButton = this.game.input.keyboard.addKey(Controls.buttons.B);
        this.cButton = this.game.input.keyboard.addKey(Controls.buttons.C);
        this.dButton = this.game.input.keyboard.addKey(Controls.buttons.START);
        this.leftDirection = this.game.input.keyboard.addKey(Controls.joystick.LEFT);
        this.rightDirection = this.game.input.keyboard.addKey(Controls.joystick.RIGHT);
        this.downDirection = this.game.input.keyboard.addKey(Controls.joystick.DOWN);
    }

    onBallLost() {
        this.paddle.reset(this.ball);
        this.player.reset();
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

    onPlayerHitBrick(brick) {
        if (this.ball.type === brick.type) {
            this.player.power++;
            this.player.rush++;
            this.hud.powerUIComponent.update(this.player.power);
        } else {
            this.player.rush = 0;
        }
        this.ball.type = Ball.Type.NEUTRAL;
        this.hud.levelLifeUIComponent.update(this.bricks.count());
        this.hud.rushUIComponent.update(this.player.rush);
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
        if (this.aButton.isDown) {
            this.ball.type = Ball.Type.A;
        }
        if (this.bButton.isDown) {
            this.ball.type = Ball.Type.B;
        }
        if (this.cButton.isDown) {
            this.ball.type = Ball.Type.C;
        }
        if (this.dButton.isDown) {
            this.ball.type = Ball.Type.D;
        }
        if (this.aButton.isDown || this.bButton.isDown || this.cButton.isDown || this.dButton.isDown) {
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