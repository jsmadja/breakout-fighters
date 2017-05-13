class LifeUIComponent {

    constructor(game) {
        this.game = game;
    }

    create(x, y, initialLife) {
        this.component = this.game.add.text(x, y, `life: ${initialLife}`, {
            font: '20px Courrier',
            fill: '#00FF00',
            align: 'left'
        });
    }

    update(life) {
        this.component.text = `life: ${life}`;
    }
}
module.exports = LifeUIComponent;