class Brick {
    constructor(group, type, x, y) {
        const brick = group.create(x, y, 'sprites', `${type}/${type}.png`);
        brick.body.bounce.set(1);
        brick.body.immovable = true;
    }

    static reflect(_ball, _brick) {
        _brick.kill();
    }
}

const START_X = 3;
const START_Y = 30;
const BRICK_WIDTH = 20;
const BRICK_HEIGHT = 10;

class Bricks {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.group = this.game.add.group();
        this.group.enableBody = true;
        this.group.physicsBodyType = Phaser.Physics.ARCADE;
    }

    addBrickAt(type, x, y) {
        new Brick(this.group, type, x, y);
    }

    update(ball) {
        this.game.physics.arcade.collide(ball.sprite, this.group, Brick.reflect, this.onBallHitBrick, this);
    }

    reset() {
        this.group.callAll('revive');
    }

    createWall(data) {
        const rows = data.split('\n');
        let y = START_Y;
        rows.forEach(row => {
            const bricks = row.split('');
            let x = START_X;
            bricks.forEach(brick => {
                this.addBrickAt(brick, x, y);
                x += BRICK_WIDTH + 1;
            });
            y += BRICK_HEIGHT + 1;
        });
    }

    count() {
        return this.group.countLiving();
    }

}

module.exports = Bricks;