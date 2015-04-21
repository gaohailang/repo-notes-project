var GitHubApi = require("github");
var _ = require('lodash');


var GitHubAuth = require('./config').github.auth;
var debug = require('debug')('github');
require('./utility');

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

/*github.repos.get({
    user: 'gaohailang',
    repo: 'muce-fe'
}, S(function(res) {
    _.pickDeep(res, dotToCamelKey([
        'id', 'name', 'description', 'full_name',
        'forks_count', 'stargazers_count', 'watchers_count',
        'updated_at', 'created_at', 'size',
        'owner.login', 'owner.avatar_url',
    ]));
}));*/

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
            ]));
            debug('getRepoStats %o', ret);
            cb(ret);
        }));
    }
};