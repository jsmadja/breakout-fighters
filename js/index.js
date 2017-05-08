const WIDTH = 320;
const HEIGHT = 224;

const BreakOutFighters = require('./breakout-fighters');
const breakOutFighters = new BreakOutFighters(WIDTH, HEIGHT);

new Phaser.Game(WIDTH, HEIGHT, Phaser.AUTO, 'phaser-example', {
    preload: breakOutFighters.preload,
    create: breakOutFighters.create.bind(breakOutFighters),
    update: breakOutFighters.update.bind(breakOutFighters),
});