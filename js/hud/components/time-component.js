class TimeUIComponent {

    constructor(game) {
        this.game = game;
    }

    create(x, y) {
        this.component = this.game.add.text(x, y, '99', {
            font: '20px Courrier',
            fill: '#FFFFFF',
        });
    }

    update(time) {
        this.component.text = time;
        this.component.visible = !!time;
    }
}
module.exports = TimeUIComponent;