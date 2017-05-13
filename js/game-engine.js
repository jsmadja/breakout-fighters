const Player = require('./domain/player');
const Controls = require('./controls');
const Bricks = require('./bricks');
const HUD = require('./hud');
const Ball = require('./ball');
const _ = require('lodash');
const SpecialMoves = require('./special-moves');

const SPECIAL_MOVE_POWER_BONUS = 10;
const NORMAL_MOVE_POWER_BONUS = 1;

class GameEngine {
    constructor(game) {
        this.game = game;
        this.player = new Player();
        this.bricks = new Bricks(game);
        this.bricks.onBallHitBrick = this.onPlayerHitBrick.bind(this);
        this.hud = new HUD(game);
        this.control_history = [];
    }

    preload() {
        this.game.load.atlas('sprites', 'assets/sprites/sprite.png', 'assets/sprites/sprite.json');
        this.game.load.text('level_1', '../assets/levels/level_1/wall.data');
        this.hud.preload();
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
        this.hud.levelLifeUIComponent.update(this.bricks.life);
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
            if (this.player.specialMoving) {
                this.player.power += SPECIAL_MOVE_POWER_BONUS;
            } else {
                this.player.power += NORMAL_MOVE_POWER_BONUS;
            }
            this.player.rush++;
            this.hud.powerUIComponent.update(this.player.power);
        } else {
            this.player.rush = 0;
        }
        this.ball.type = Ball.Type.NEUTRAL;
        this.hud.levelLifeUIComponent.update(this.bricks.life);
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
            this.insertInputHistory(Controls.buttons.A);
        }
        if (this.bButton.isDown) {
            this.ball.type = Ball.Type.B;
            this.insertInputHistory(Controls.buttons.B);
        }
        if (this.cButton.isDown) {
            this.ball.type = Ball.Type.C;
            this.insertInputHistory(Controls.buttons.C);
        }
        if (this.dButton.isDown) {
            this.ball.type = Ball.Type.D;
            this.insertInputHistory(Controls.buttons.D);
        }
        if (this.aButton.isDown || this.bButton.isDown || this.cButton.isDown || this.dButton.isDown) {
            this.detectSpecialMove();
            this.paddle.release(this.ball);
        }
        if (this.leftDirection.isDown) {
            this.paddle.moveLeft();
            this.insertInputHistory(Controls.joystick.LEFT);
        }
        if (this.rightDirection.isDown) {
            this.paddle.moveRight();
            this.insertInputHistory(Controls.joystick.RIGHT);
        }
        if (this.downDirection.isDown) {
            this.insertInputHistory(Controls.joystick.DOWN);
        }

        if (this.rightDirection.isDown && this.downDirection.isDown) {
            this.insertInputHistory(Controls.joystick.DOWN_RIGHT);
        }
        if (this.leftDirection.isDown && this.downDirection.isDown) {
            this.insertInputHistory(Controls.joystick.DOWN_LEFT);
        }

        if (this.playerHasInputedJustDefend()) {
            this.player.justDefend();
        }
        this.paddle.update(this.ball);
        this.bricks.update(this.ball);
    }

    detectSpecialMove() {
        const now = new Date().getTime();
        const history = _(this.control_history).filter(input => (now - input.date) < 1000).map(input => input.input).value();
        if (SpecialMoves.isSpecialMove(history)) {
            this.control_history = [];
            this.player.doSpecialMove();
        }
    }

    insertInputHistory(input) {
        if (input !== this.last_input) {
            this.control_history.push({ input, date: new Date().getTime() });
        }
        this.last_input = input;
        this.control_history = _.takeRight(this.control_history, 10);
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