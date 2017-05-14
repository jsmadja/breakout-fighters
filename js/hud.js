const LifeUIComponent = require('./hud/components/life-component');
const JustDefendUIComponent = require('./hud/components/just-defend-component');
const RushUIComponent = require('./hud/components/rush-component');
const PowerUIComponent = require('./hud/components/power-component');
const TimeUIComponent = require('./hud/components/time-component');

class HUD {

    constructor(game) {
        this.game = game;
        this.playerLifeUIComponent = new LifeUIComponent(game);
        this.levelLifeUIComponent = new LifeUIComponent(game);
        this.justDefendUIComponent = new JustDefendUIComponent(game);
        this.rushUIComponent = new RushUIComponent(game);
        this.powerUIComponent = new PowerUIComponent(game);
        this.timeIUComponent = new TimeUIComponent(game);
    }

    create(player, bricks) {
        this.playerLifeUIComponent.create(0, 10, player.life);
        this.levelLifeUIComponent.create(190, 10, bricks.life, true);
        this.powerUIComponent.create(10, 210);
        this.justDefendUIComponent.create();
        this.rushUIComponent.create();
        this.timeIUComponent.create(this.game.world.centerX - 10, 3);
    }

    preload() {
        this.powerUIComponent.preload();
        this.playerLifeUIComponent.preload();
        this.levelLifeUIComponent.preload();
    }

}

module.exports = HUD;