var express = require('express');
var router = express.Router();
var load = require("../module/load")
var createImgs = require("../module/getImage")
var loadImg = require("../module/loadImg")
var sendMsg = require("../module/sendMsg")
var sendEmail = require("../module/sendEmail")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/createNews', function(req, res) {
    load(function(result){
        res.send(result)
    });
});
router.get('/createImgs', function(req, res) {
    createImgs(function(result){
        res.send(result)
    });
});
router.get('/loadImg', function(req, res) {
    loadImg(function(result){
        res.send(result)
    });
});
router.get('/sendMsg', function(req, res) {
    sendMsg(function(result){
        res.send(result)
    });
});
router.get('/sendEmail', function(req, res) {
    let time = {hour: req.query.hour, min: req.query.min}
    sendEmail(time,function(result){
        res.send(result)
    });
});
router.get('/public/images/2.jpg', function(req, res) {

});
module.exports = router;
