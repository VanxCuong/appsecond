var express = require('express');
var passport= require("passport");
var router = express.Router();
router.get('/google',passport.authenticate('google',{scope:['profile']}));
router.get('/google/redirect', passport.authenticate('google'),function(req, res,next) {
    res.send("oke")
});
module.exports = router;