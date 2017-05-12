const LifeUIComponent = require('./hud/components/life-ui-component');

class HUD {

    constructor(game) {
        this.lifeUIComponent = new LifeUIComponent(game);
    }

    create() {
        this.lifeUIComponent.create();
    }

}

module.exports = HUD;