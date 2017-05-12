const MAX_LIFE = 100;

class Player {
    constructor() {
        this.restoreFullLife();
    }

    receiveNormalDamage() {
        this.life -= 10;
    }

    restoreFullLife() {
        this.life = MAX_LIFE;
    }

    isKO() {
        return this.life <= 0;
    }
}

module.exports = Player;