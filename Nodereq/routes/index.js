var express = require('express');
var router = express.Router();
var load = require("../module/load")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/createNews', function(req, res) {
    load(function(result){
        res.send(result)
    });
});

module.exports = router;
