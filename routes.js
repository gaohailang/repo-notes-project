var express = require('express');
var router = express.Router();

var fs = require('fs');

var github = require('./github');
var kickkass = require('./kickass');

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


router.get('/kickass/:query', function(req, res) {
    kickkass.search(req.params.query, defaultJSONResponser(res));
});

function defaultJSONResponser(res) {
    return function(data) {
        res.json({
            meta: {
                client: 'blah'
            },
            data: data
        });
    };
}

module.exports = router;