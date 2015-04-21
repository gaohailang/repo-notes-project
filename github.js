var GitHubApi = require("github");
var _ = require('lodash');
var debug = require('debug')('utility');

var GitHubAuth = require('./config').github.auth;

require('debug').formatters.o = function(obj) {
    return JSON.stringify(obj, null, 4);
};

/* utility */

function dummyCallback(err, res) {
    console.log(JSON.stringify(err ? err : res));
}

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

var github = new GitHubApi({
    // required
    version: "3.0.0",
    // optional
    debug: true,
    timeout: 5000,
    headers: {
        "user-agent": "Sivagao-Robot" // GitHub is happy with a unique user agent
    }
});

github.authenticate({
    type: "basic",
    username: GitHubAuth.name,
    password: GitHubAuth.password
});

/*github.user.getFollowingFromUser({
    user: "gaohailang"
}, dummyCallback);*/

github.repos.get({
    user: 'gaohailang',
    repo: 'muce-fe'
}, S(function(res) {
    _.pickDeep(res, dotToCamelKey([
        'id', 'name', 'description', 'full_name',
        'forks_count', 'stargazers_count', 'watchers_count',
        'updated_at', 'created_at', 'size',
        'owner.login', 'owner.avatar_url',
    ]));
}));

exports = module.exports = {
    getRepoStats: function(full_name, cb) {
        var parts = full_name.split('/');
        github.repos.get({
            user: parts[0],
            repo: parts[1]
        }, S(function(res) {
            var ret = _.pickDeep(res, dotToCamelKey([
                'id', 'name', 'description', 'full_name',
                'forks_count', 'stargazers_count', 'watchers_count',
                'updated_at', 'created_at', 'size',
                'owner.login', 'owner.avatar_url',
            ]))
            cb(ret);
        }));
    }
};