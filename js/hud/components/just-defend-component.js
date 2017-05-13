class JustDefendUIComponent {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.component = this.game.add.text(10, 30, 'Just Defend !', {
            font: '20px Courrier',
            fill: '#FFFF00',
            align: 'left'
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