const _ = require('lodash');

const templates = [
    [40, 'DOWN_RIGHT', 39, 65], // hadoken A
    [40, 'DOWN_RIGHT', 39, 90], // hadoken B
    [40, 'DOWN_RIGHT', 39, 69], // hadoken C
    [40, 'DOWN_RIGHT', 39, 82], // hadoken D
];

class SpecialMoves {
    static isSpecialMove(history) {
        return _(templates)
                .map(template => _.isEqual(template, _.intersection(template, history)))
                .filter(t => !!t)
                .value()
                .length > 0;
    }
}

module.exports = SpecialMoves;