const brickWidth = 30;
const brickHeight = 16;
const marginLeft = (320 - (8 * brickWidth)) / 2;
const marginTop = 40;
const maxRows = 2;
const maxColumns = 8;

class Brick {
    constructor(group, x, y, row) {
        const brick = group.create(x, y, 'breakout', 'brick_' + (row + 1) + '_1.png');
        brick.body.bounce.set(1);
        brick.body.immovable = true;
    }
}

class Bricks {

    constructor(game) {
        this.group = game.add.group();
        this.group.enableBody = true;
        this.group.physicsBodyType = Phaser.Physics.ARCADE;
        this.createBricks();
    }

    createBricks() {
        for (let row = 0; row < maxRows; row++) {
            for (let column = 0; column < maxColumns; column++) {
                const x = marginLeft + (column * brickWidth);
                const y = marginTop + (row * brickHeight);
                new Brick(this.group, x, y, row);
            }
        }
    }

    revive() {
        this.group.callAll('revive');
    }

    isEmpty() {
        return this.group.countLiving() === 0;
    }

}

module.exports = Bricks;