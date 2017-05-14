class RushUIComponent {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.component = this.game.add.text(10, 20, 'Rush', {
            font: '10px Courrier',
            fill: '#FF00FF',
        });
        this.component.visible = false;
    }

    update(rush) {
        this.component.text = `Rush ${rush}`;
        this.component.visible = rush >= 2;
    }

}
module.exports = RushUIComponent;