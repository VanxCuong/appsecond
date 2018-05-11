var express = require('express');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var passportjs=require("../lib/passport");
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  
  res.render('index', { title: 'Express' });
});
router.get('/news', function(req, res, next) {
  res.render('news_detail', { title: 'Express' });
});
router.get('/login', function(req, res, next) {
  res.render('login', {errors:null });
});
router.post('/login',
  passport.authenticate('local',{ successRedirect: '/',
                                   failureRedirect: '/login',
                                   failureFlash: true })
);
router.get('/contact', function(req, res, next) {
  res.render('contact', { title: 'Express' });
});
router.get('/test', function(req, res, next) {
  res.render('test', { title: 'Express' });
});


module.exports = router;
