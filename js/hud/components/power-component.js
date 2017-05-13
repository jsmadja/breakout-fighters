class PowerUIComponent {

    constructor(game) {
        this.game = game;
    }

    create(x, y) {
        this.component = this.game.add.text(x, y, `power: 0`, {
            font: '10px Courrier',
            fill: '#00FF00',
            align: 'left'
        });
    }

    update(power) {
        this.component.text = `power: ${power}`;
    }
}
module.exports = PowerUIComponent;