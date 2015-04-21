var express = require('express');
var router = express.Router();

var fs = require('fs');

var github = require('./github');

router.get('/', function(req, res) {
    /*res.render('index', {
        title: 'Express'
    });*/
    res.json({
        text: 'Welcome it~'
    });
});

router.get('/repo/:author/:repo', function(req, res) {
    github.getRepoStats(req.params.author + '/' + req.params.repo, defaultJSONResponser(res));
});


function defaultJSONResponser(res) {
    return function(repo) {
        res.json({
            meta: {
                client: 'blah'
            },
            data: repo
        });
    };
}

module.exports = router;