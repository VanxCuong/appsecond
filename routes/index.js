var express = require('express');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var passportjs=require("../lib/passport");

var news=require("../models/news");
var category=require("../models/category");
var lib=require("../lib/lib");
var slug=require("../lib/slug");
var router = express.Router();
var numberPage=4;
/* GET home page. */
router.get('/', function(req, res, next) {
  console.log(req.user);
  
  Promise.all([news.getLimitDocument({status:1},numberPage,0),category.getDocument()]).then(value=>{
    res.render('index', {news:value[0],category:value[1]});
  })
});
router.post('/load', function(req, res, next) {
  var NumberPageNew=(req.body.page-1)*numberPage;
  console.log(NumberPageNew);
  
  var xHTML="";
  news.getLimitDocument({status:1},numberPage,NumberPageNew).then(value=>{
    console.log(value.length);
    
    if(value.length>0){
      value.forEach(element => {
        xHTML+=`<div class="frames-news-main">
                <div class="card text-white frames-news">
                    <a href="/news/${element.token}.${element._id}"><div class="img-news" style="background-image:url('./uploads/${element.image}')"></div></a>
                    <div class="card-body">
                        <h4 class="card-title title-news"><a href="/news/${element.token}.${element._id}">${element.title}</a></h4>
                        <div class="card-text des-news">${element.description}</div>
                    </div>
                    <div class="card-footer">
                        <div class="evaluate">
                            <span class="quantity">3</span>
                            <span class="element-evl like"><i class="far fa-thumbs-up"></i></span>
                            <span class="quantity">3</span>
                            <span class="element-evl heart"><i class="far fa-heart"></i></span>
                        </div>
                        <div class="detail-news"><i class="fas fa-arrow-right"></i></div>
                    </div>
                </div>
            </div>`;
      });
      res.send(xHTML);
    }else{
      res.send(false);
    }
  })
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
// Search
router.get('/you', function(req, res, next) {
  var text=req.query.search;
  var txtSearch=slug(text);
  const regex=new RegExp(lib.escapeRegex(txtSearch),'gi');
  Promise.all([news.findOrtherDocument({token:regex}),category.getDocument({})]).then(value=>{
    res.render('search', {news:value[0],category:value[1],keyword:text});
  })

});

module.exports = router;
