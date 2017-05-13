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
        this.playerLifeUIComponent.create(10, 10, player.life);
        this.levelLifeUIComponent.create(200, 10, bricks.count());
        this.powerUIComponent.create(10, 200);
        this.justDefendUIComponent.create();
        this.rushUIComponent.create();
    }

}

module.exports = HUD;