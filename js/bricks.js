const START_X = 3;
const START_Y = 40;
const BRICK_WIDTH = 20;
const BRICK_HEIGHT = 10;

class BrickShadow {
    constructor(shadowGroup, type, x, y) {
        this.offset = new Phaser.Point(2, 2);
        this.sprite = shadowGroup.create(x + (BRICK_WIDTH / 2) + this.offset.x, y + (BRICK_HEIGHT/2) + this.offset.y, 'sprites', `${type}/${type}.png`);
        this.sprite.anchor.set(0.5);
        this.sprite.tint = 0x000000;
        this.sprite.alpha = 0.6;
    }

}

class Brick {
    constructor(bricksGroup, type, x, y, shadow) {
        this.sprite = bricksGroup.create(x, y, 'sprites', `${type}/${type}.png`);
        this.sprite.body.bounce.set(1);
        this.sprite.body.immovable = true;
        this.sprite.type = type;
        this.sprite.animations.add('normal', Phaser.Animation.generateFrameNames(`${type}/`, 1, 1, '.png'));
        this.sprite.animations.add('maxmode', Phaser.Animation.generateFrameNames('maxmode/bricks_maxmode_', 1, 1, '.png'));
        this.sprite.animations.play('normal');
        this.sprite.shadow = shadow;
    }

    activateMaxMode() {
        this.sprite.animations.play('maxmode');
    }

    deactivateMaxMode() {
        this.sprite.animations.play('normal');
    }
}

class Bricks {

    constructor(game) {
        this.game = game;
        this.bricks = [];
        this.bricksShadow = [];
    }

    create() {
        this.group = this.game.add.group();
        this.groupShadows = this.game.add.group();
        this.group.enableBody = true;
        this.group.physicsBodyType = Phaser.Physics.ARCADE;

        const group1 = this.game.add.group();
        group1.add(this.groupShadows);
        group1.add(this.group);

    }

    addBrickAt(type, x, y) {
        const shadow = new BrickShadow(this.groupShadows, type, x, y, this.game);
        const brick = new Brick(this.group, type, x, y, shadow);
        this.bricksShadow.push(shadow);
        this.bricks.push(brick);
    }

    update(ball) {
        const onCollision = (_ball, _brick) => {
            if (this.maxmode || _ball.type === _brick.type) {
                _brick.shadow.sprite.kill();
                _brick.kill();
            }
            this.collidedBrick = _brick;
        };
        if (this.game.physics.arcade.collide(ball.sprite, this.group, onCollision, null, this)) {
            this.onBallHitBrick(this.collidedBrick);
        }
    }

    reset() {
        this.group.callAll('revive');
        this.groupShadows.callAll('revive');
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
        this.total = this.count();
    }

    count() {
        return this.group.countLiving();
    }

    get life() {
        return 100 * (this.count() / this.total);
    }

    activateMaxMode() {
        this.maxmode = true;
        this.bricks.forEach(brick => brick.activateMaxMode());
    }

    deactivateMaxMode() {
        this.maxmode = false;
        this.bricks.forEach(brick => brick.deactivateMaxMode());
    }

}

module.exports = Bricks;