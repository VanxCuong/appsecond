var express = require('express');
var news=require("../models/news");
var category=require("../models/category");
var lib=require("../lib/lib");
var UserRegisterNew=require("../models/UserRegisterNew");
var router = express.Router();
var numberPage=4;
router.get('/',lib.sessionURL,function(req, res, next) {
    Promise.all([news.getLimitDocument({status:1},numberPage,0),category.getDocument()]).then(value=>{
      res.render('live', {news:value[0],category:value[1]});
    })
});
router.get('/detail',lib.sessionURL,function(req, res, next) {
  res.render('live_detail');
});
module.exports = router;