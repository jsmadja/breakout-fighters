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
        const visible = rush >= 2;
        if (visible) {
            this.component.visible = true;
            setTimeout(() => {
                this.component.visible = false;
            }, 1000);
        }
    }

}
module.exports = RushUIComponent;