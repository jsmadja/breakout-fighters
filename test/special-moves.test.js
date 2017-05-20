const assert = require('assert');

const SpecialMoves = require('../js/domain/special-moves');

describe('Special Moves', () => {

    it('should not recognize hadoken', () => {
        const history = [40, 39];
        assert.equal(SpecialMoves.isSpecialMove(history), false);
    });

    it('should recognize hadoken', () => {
        const history = [];
        history.push(40);
        history.push('DOWN_RIGHT');
        history.push(39);
        history.push(65);
        assert.ok(SpecialMoves.isSpecialMove(history));
    });

    it('should recognize hadoken with inputs before', () => {
        const history = [];
        history.push('DOWN_RIGHT');
        history.push(40);
        history.push('DOWN_RIGHT');
        history.push(39);
        history.push(65);
        assert.ok(SpecialMoves.isSpecialMove(history));
    });

    it('should recognize hadoken with inputs after', () => {
        const history = [];
        history.push(40);
        history.push('DOWN_RIGHT');
        history.push(39);
        history.push(65);
        history.push(DOWN_RIGHT);
        assert.ok(SpecialMoves.isSpecialMove(history));
    });

    it('should recognize hadoken with inputs before and after', () => {
        const history = [];
        history.push('DOWN_RIGHT');
        history.push(40);
        history.push('DOWN_RIGHT');
        history.push(39);
        history.push(65);
        history.push('DOWN_RIGHT');
        assert.ok(SpecialMoves.isSpecialMove(history));
    });

});