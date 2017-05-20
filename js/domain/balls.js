const Ball = require('./ball');

class Balls {

    constructor(game) {
        this.game = game;
        this.balls = [];
        this.addOne();
    }

    addOne() {
        this.balls.push(new Ball(this.game));
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
        return this.balls[0].height;
    }

    get width() {
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

}

module.exports = Balls;