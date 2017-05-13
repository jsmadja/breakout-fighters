const LifeUIComponent = require('./hud/components/life-component');
const JustDefendUIComponent = require('./hud/components/just-defend-component');
const RushUIComponent = require('./hud/components/rush-component');
const PowerUIComponent = require('./hud/components/power-component');

class HUD {

    constructor(game) {
        this.playerLifeUIComponent = new LifeUIComponent(game);
        this.levelLifeUIComponent = new LifeUIComponent(game);
        this.justDefendUIComponent = new JustDefendUIComponent(game);
        this.rushUIComponent = new RushUIComponent(game);
        this.powerUIComponent = new PowerUIComponent(game);
    }

    create(player, bricks) {
        this.playerLifeUIComponent.create(0, 10, player.life);
        this.levelLifeUIComponent.create(190, 10, bricks.life, true);
        this.powerUIComponent.create(10, 210);
        this.justDefendUIComponent.create();
        this.rushUIComponent.create();
    }

    preload() {
        this.powerUIComponent.preload();
        this.playerLifeUIComponent.preload();
        this.levelLifeUIComponent.preload();
    }

}

module.exports = HUD;