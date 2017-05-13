const LifeUIComponent = require('./hud/components/life-ui-component');
const JustDefendUIComponent = require('./hud/components/just-defend-component');
const RushUIComponent = require('./hud/components/rush-component');

class HUD {

    constructor(game) {
        this.playerLifeUIComponent = new LifeUIComponent(game);
        this.levelLifeUIComponent = new LifeUIComponent(game);
        this.justDefendUIComponent = new JustDefendUIComponent(game);
        this.rushUIComponent = new RushUIComponent(game);
    }

    create(player, bricks) {
        this.playerLifeUIComponent.create(10, 10, player.life);
        this.levelLifeUIComponent.create(200, 10, bricks.count());
        this.justDefendUIComponent.create();
        this.rushUIComponent.create();
    }

}

module.exports = HUD;