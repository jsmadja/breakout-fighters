const _ = require('lodash');

const templates = [
    [39, 37, 'DOWN_LEFT', 40, 'DOWN_RIGHT', 65], // Haou Shokouken A
];

class DesperationMoves {
    static isDesperationMove(history) {
        return _(templates)
                .map(template => _.isEqual(template, _.intersection(template, history)))
                .filter(t => !!t)
                .value()
                .length > 0;
    }
}

module.exports = DesperationMoves;