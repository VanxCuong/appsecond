var express = require('express');
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
var passportjs=require("../lib/passport");
var news=require("../models/news");
var roleUser=require("../models/roleUser");
var category=require("../models/category");
var lib=require("../lib/lib");
var slug=require("../lib/slug");
var router = express.Router();
var numberPage=4;
/* GET home page. */
/**
 * phát id vs name của user ra interface.
 */
router.get('/session/users', (req, res) => {
  
  var data={status:false,_id:""};
  if(req.user){
    roleUser.findOption({user_id:req.user._id}).then(value=>{
      data={status:true,_id:req.user._id,fullname:req.user.fullname,role:value[0].role_id.name};
      res.send(data);
    })
  }else{
    res.send(data);
  }
  
});
/**
 * Đăng Xuất
 */
router.get('/logout', function(req, res){
  req.logout();
  res.redirect(req.session.url);
  delete req.session.url
});
/**
 * Frames HOME WebSite
 * news.getLimitDocument({status:1},numberPage,0): Lấy Số Lượng bài viết
 * category.getDocument(): Lấy All Danh Mục
 */
router.get('/',lib.sessionURL,function(req, res, next) {
  Promise.all([news.getLimitDocument({status:1},numberPage,0),category.getDocument()]).then(value=>{
    res.render('index', {news:value[0],category:value[1]});
  })
});
/**
 * URL: /load
 * Nhiệm vụ : Khi người dùng scroll chuột tại trang chủ sẽ load thêm bài viết
 */
router.post('/load', function(req, res, next) {
  var NumberPageNew=(req.body.page-1)*numberPage;
  var xHTML="";
  news.getLimitDocument({status:1},numberPage,NumberPageNew).then(value=>{
    if(value.length>0){
      xHTML=lib.BrowserNews(value);
      res.send(xHTML);
    }else{
      res.send(false);
    }
  })
});

/**
 * Frames Interface Login
 */
router.get('/login',lib.sessionURL,function(req, res, next) {
  if(req.user){
     res.redirect('/');
  }
  res.render('login', {errors:null });
});
/**
 * Frames Login (POST Nhận dữ liệu từ client) => Đăng Nhập
 */
// router.post('/login',
//   passport.authenticate('local',{ successRedirect: '/',
//                                    failureRedirect: '/login',
//                                    failureFlash: true })
// );
router.post('/login', function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      return res.send({ success : false, message : 'Tài khoản hoặc mật khẩu không đúng' });
    }
    req.login(user, function(err){
      if(err){
        return next(err);
      }
      return res.send({ success : true, message :'Đăng nhập thành công' });
    });
  })(req, res, next);
});

/**
 * Framonmes Interface Contact
 */
router.get('/contact',lib.sessionURL, function(req, res, next) {
  res.render('contact', { title: 'Express' });
});

/**
 * URL: /you
 * Nhiệm vụ tìm kiếm giá trị client gửi lên server.
 * Kết quả: Trả về tất cả giá trị tìm kiếm
 */
router.get('/you',lib.sessionURL, function(req, res, next) {
  var text=req.query.search;
  var txtSearch=slug(text);
  const regex=new RegExp(lib.escapeRegex(txtSearch),'gi');
  Promise.all([news.findOrtherDocument({token:regex}),category.getDocument({})]).then(value=>{
    res.render('search', {news:value[0],category:value[1],keyword:text});
  })

});

/**
 * Đánh Giá bài viết.
 */
router.post("/evaluate/:id",(req,res,next)=>{
    var idUser=req.params.id;
    var {level,text,name,idNews}=req.body;
    var dataEvaluate={
      user_id:idUser,
      name:name,
      text:text,
      level:level
    };
    news.createEvaluate(idNews,dataEvaluate).then(value=>{
      res.send(true);
    }).catch((err) => {
      res.send(false);
    })
})

module.exports = router;
