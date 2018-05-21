var express = require('express');
var passport= require("passport");
var router = express.Router();
router.get('/google',passport.authenticate('google',{scope:['profile','email']}));
router.get('/google/redirect', 
  passport.authenticate('google', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});


router.get('/facebook',passport.authenticate('facebook',{scope:['email']}));
router.get('/facebook/redirect', 
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function(req, res) {
    res.redirect('/');
});

module.exports = router;