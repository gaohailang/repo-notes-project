var request = require('request');
var _ = require('lodash');

var debug = require('debug')('kickass');
require('./utility');

exports = module.exports = {
    search: function(q, cb) {
        request.get({
            url: 'http://kickass.to/json.php',
            qs: {
                field: 'seeders',
                q: q
            },
            json: true
        }, function(err, resp, body) {
            // S_CB(arguments);
            var ret;
            if (!err && body.list) {
                ret = body;
                debug('search %o', _.pickDeep(body, dotToCamelKey([
                    'total_results', 'list[0].title', 'list[0].seeds', 'list[0].peers'
                ])));
            } else {
                ret = {
                    err: 'not found'
                }
            }
            cb(ret);
            // return ret;
        });
    }
};