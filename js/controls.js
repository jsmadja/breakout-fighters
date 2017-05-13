class Controls {

    static get buttons() {
        return {
            A: Phaser.KeyCode.A,
            B: Phaser.KeyCode.Z,
            C: Phaser.KeyCode.E,
            D: Phaser.KeyCode.R,
            START: Phaser.Keyboard.SPACEBAR,
        };
    }

    static get joystick() {
        return {
            LEFT: Phaser.Keyboard.LEFT,
            RIGHT: Phaser.Keyboard.RIGHT,
            DOWN: Phaser.Keyboard.DOWN,
            DOWN_RIGHT: 'DOWN_RIGHT',
            DOWN_LEFT: 'DOWN_LEFT',
        };
    }
}

module.exports = Controls;