const MAX_LIFE = 100;
const JUST_DEFEND_TIMING = 200;
const SPECIAL_MOVE_TIMING = 500;
const NORMAL_DAMAGE = 1;

class Player {
    constructor() {
        this.power = 0;
        this.reset();
    }

    receiveNormalDamage() {
        this.life -= NORMAL_DAMAGE;
    }

    reset() {
        this.restoreFullLife();
        this.rush = 0;
        this.justDefending = false;
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

    doSpecialMove() {
        this.specialMoving = true;
        setTimeout(() => {
            this.specialMoving = false;
        }, SPECIAL_MOVE_TIMING);
    }

    activateMaxMode() {
        this.maxmode = true;
        this.maxmodeActivationTime = new Date().getTime();
    }

    deactivateMaxMode() {
        this.power = 0;
        this.maxmode = false;
        delete this.maxmodeActivationTime;
    }

    canActivateMaxmode() {
        return this.power >= 100;
    }

}

module.exports = Player;