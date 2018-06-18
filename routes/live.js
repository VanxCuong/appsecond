var express = require('express');
var news=require("../models/news");
var category=require("../models/category");
var live=require("../models/live");
var lib=require("../lib/lib");
var UserRegisterNew=require("../models/UserRegisterNew");
var router = express.Router();
var numberPage=4;
router.get('/',lib.sessionURL,function(req, res, next) {
    Promise.all([news.getLimitDocument({status:1},numberPage,0),category.getDocument(),live.findOption({})]).then(value=>{
      res.render('live', {news:value[0],category:value[1],live:value[2]});
    })
});
router.get('/*.:id',lib.sessionURL,function(req, res, next) {
  var id=req.params.id;
  var user=req.user;
  live.findOne({_id:id}).populate("user_id").then(value=>{
    res.render('live_detail',{live:value,user:user});
  }).catch(err=>{
    res.redirect("/live");
  })
  
});
module.exports = router;