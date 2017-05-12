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
    }

}

module.exports = Bricks;