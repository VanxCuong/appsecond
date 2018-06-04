var express = require('express');
var user=require("../models/user");
var role=require("../models/role");
var roleUser=require("../models/roleUser");
var encode=require("../lib/encode");
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});
router.post('/register/account', function(req, res, next) {
  var {fullname,email,password,reqpassword}=req.body;
  req.check("email","Bạn chưa nhập Email").isEmail();
  req.check("password","Bạn vui lòng nhập đúng mật khẩu").equals(reqpassword).isLength({min:5});
  var errors=req.validationErrors();
  if(!errors){
    var data={
      fullname:fullname,
      email:email,
      password:password,
      token:slug(fullname)
    }
    data.password=encode.hash_password(password);
    user.findOption({email:email})
    .then(value=>{
      if(value.length==0)
        return Promise.resolve(value);
     return Promise.reject(new Error("Không thể Insert"));
    })
    .then(value=>{
      var insertUser=new user(data);
      insertUser.save((err,result)=>{
          findIdRole(idRole=>{
            var dl=new roleUser({
              user_id:insertUser._id,
              role_id:idRole
            })
            dl.save((err,result)=>{
              if(err){
                req.flash("mess-register",{status:false,text:"Tạo tk không thành công"});
                return res.redirect("/admin/register");
              }
              req.flash("mess-register",{status:true,text:"Đăng ký thành công"});
              return res.redirect("/admin/register");
            })
          })
      })
    })
    .catch(err=>{
      req.flash("mess-register",{status:false,text:`Tài khoản ${email} đã tồn tại !!!`});
      return res.redirect("/admin/register");
    })
  }else{
    errors.forEach(element => {
      if(element.param="password"){
        req.flash("mess-register",{status:false,text:"[Báo lỗi]- Mật khẩu không đúng hoặc ít hơn 5 kí tự."});
        return res.redirect("/admin/register");
      }
    });
  }
});
router.post('/register/check', function(req, res, next) {
  user.findOption(req.body).then(result=>{
    if(result.length==0)
      return res.send(true);
    return res.send(false);
  }).catch(err=>{
    return res.send(false);
  })
});


var findIdRole=cb=>{
  role.findOption({name:"Thính Giả"}).then(value=>{
    cb(value[0]._id);
  })
}
module.exports = router;
