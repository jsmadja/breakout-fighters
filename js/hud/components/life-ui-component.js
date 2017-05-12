class LifeUIComponent {

    constructor(game) {
        this.game = game;
    }

    create() {
        this.component = this.game.add.text(10, 10, 'life: 100', { font: '20px Courrier', fill: '#00FF00', align: 'left' });
    }

    update(life) {
        this.component.text = `life: ${life}`;
    }
}
module.exports = LifeUIComponent;