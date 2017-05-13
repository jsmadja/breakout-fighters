class JustDefendUIComponent {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.component = this.game.add.text(10, 30, 'Just Defend !', {
            font: '10px Courrier',
            fill: '#FFFF00',
        });
        this.component.visible = false;
    }

    show() {
        this.component.visible = true;
        setTimeout(() => {
            this.component.visible = false;
        }, 1000);
    }

}
module.exports = JustDefendUIComponent;