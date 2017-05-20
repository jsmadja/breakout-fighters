const Ball = require('./ball');
const _ = require('lodash');

class Balls {

    constructor(game) {
        this.game = game;
        this.reset();
    }

    reset(onOutOfBounds) {
        this.balls = [];
        this.addOne(onOutOfBounds);
    }

    addOne(onOutOfBounds) {
        const ball = new Ball(this.game, onOutOfBounds);
        this.balls.push(ball);
        return ball;
    }

    releaseNewOne(onOutOfBounds) {
        const ball = this.addOne(onOutOfBounds);
        ball.create();
        ball.release();
    }

    create() {
        this.balls.forEach(ball => ball.create());
    }

    activateMaxMode() {
        this.balls.forEach(ball => ball.activateMaxMode());
    }

    deactivateMaxMode() {
        this.balls.forEach(ball => ball.deactivateMaxMode());
    }

    get height() {
        if(this.isEmpty()) {
            return 0;
        }
        return this.balls[0].height;
    }

    get width() {
        if(this.isEmpty()) {
            return 0;
        }
        return this.balls[0].width;
    }

    resetAt(x, y) {
        this.balls.forEach(ball => ball.resetAt(x, y));
    }

    set type(type) {
        this.balls.forEach(ball => ball.type = type);
    }

    get type() {
        return this.balls[0].type;
    }

    release() {
        this.balls.forEach(ball => ball.release());
    }

    update() {
        this.balls.forEach(ball => ball.update());
    }

    setX(x) {
        this.balls.forEach(ball => ball.setX(x));
    }

    set onOutOfBounds(onOutOfBounds) {
        this.balls.forEach(ball => ball.onOutOfBounds = onOutOfBounds);
    }

    forEach(callback, thisArg) {
        return this.balls.forEach(callback, thisArg);
    }

    isEmpty() {
        return this.balls.length === 0;
    }

    destroyBySpriteId(spriteId) {
        const ball = _.find(this.balls, ball => ball.sprite.id === spriteId);
        ball.destroy();
        _.remove(this.balls, ball => ball.sprite.id === spriteId);
    }

}

module.exports = Balls;