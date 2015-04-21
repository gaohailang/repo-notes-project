var _ = require('lodash');
var debug = require('debug')('utility');

require('debug').formatters.o = function(obj) {
    return JSON.stringify(obj, null, 4);
};

/* utility */

/* extend lodash */
_.pickDeep = function(obj, map) {
    var ret = {};
    _.each(map, function(v, k) {
        ret[k] = pick(obj, v);
    });
    debug('pickDeep %o', ret);
    return ret;

    function pick(obj, keyLiteral) {
        return eval('obj.' + keyLiteral) || null;
    }
}

// Todo init default error hander
_.safeCallback = function(succFn) {
    return function safeCallback(err, res) {
        if (err) console.log(err);
        succFn(res);
    };
};
global.S = _.safeCallback;

function dotToCamelKey(dotKeyArr) {
    var ret = {};
    _.each(dotKeyArr, function(k) {
        ret[k.replace(/\.[a-zA-Z]/g, function(g) {
            return g[1].toUpperCase();
        })] = k;
    });
    debug('dotToCamelKey %o', ret);
    return ret;
}
global.dotToCamelKey = dotToCamelKey;


function dummyCallback(err, res) {
    console.log(JSON.stringify(err ? err : [].slice.call(arguments, 1)));
}
global.S_CB = dummyCallback;