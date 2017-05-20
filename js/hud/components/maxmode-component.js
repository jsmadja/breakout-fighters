class MaxmodeUIComponent {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.component = this.game.add.text(10, 30, 'MAX MODE !', {
            font: '10px Courrier',
            fill: '#c961e3',
        });
        this.component.visible = false;
    }

    show() {
        this.component.visible = true;
        setTimeout(() => {
            this.component.visible = false;
        }, 2000);
    }

}
module.exports = MaxmodeUIComponent;