const MAX_LIFE = 100;
const JUST_DEFEND_TIMING = 200;

class Player {
    constructor() {
        this.restoreFullLife();
        this.justDefending = false;
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

    justDefend() {
        if (!this.justDefending) {
            this.justDefending = true;
            setTimeout(() => {
                this.justDefending = false;
            }, JUST_DEFEND_TIMING);
        }
    }
}

module.exports = Player;