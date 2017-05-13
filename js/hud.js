const LifeUIComponent = require('./hud/components/life-ui-component');
const JustDefendUIComponent = require('./hud/components/just-defend-component');

class HUD {

    constructor(game) {
        this.lifeUIComponent = new LifeUIComponent(game);
        this.justDefendUIComponent = new JustDefendUIComponent(game);
    }

    create() {
        this.lifeUIComponent.create();
        this.justDefendUIComponent.create();
    }

}

module.exports = HUD;