var user=require("../models/user");
var roleUser=require("../models/roleUser");
var RouterRole=require("../models/RouterRole");
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
  var bcrypt = require('bcryptjs');
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'
},
function(username, password, done) {
  user.findOne({email:username}).exec(function(err,user){
    if (err) { return done(err); }
    if (!user) {
      return done(null, false, { message: 'Tài khoản không tồn tại' });
    }
    bcrypt.compare(password, user.password, function(err, res) {
      if(res){
          return done(null, user);
      }else{
          console.log("Mật khẩu không chính xác");
          return done(null,false,{message : 'Mật khẩu không chính xác'});
      }
    });
  })
}
));
passport.serializeUser(function(user, done) {
  checkRole(user._id);
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  user.findById(id, function(err, user) {
    done(err, user);
    }).catch(function (err) {
      console.log(err);
    });
});
var arr=[];
var arr1=[];
var arr2=[];
var checkRole=(id)=>{
  roleUser.findOption({user_id:id}).then(value=>{
    console.log(value);
    RouterRole.findExtend({role_id:value[0].role_id._id}).then(result=>{
      result.forEach(element => {
        var k=element.router_id.name.split("/");
        if(arr.indexOf(k[0])==-1){
          arr.push(k[0]);
        }
        if(arr1.indexOf(k[1])==-1){
          arr1.push(k[1]);
        }
        if(k[2]){
          if(arr2.indexOf(k[2])==-1){
            arr2.push(k[2]);
          }
        }
      });
      module.exports.arrRole=arr;
      module.exports.arrRole1=arr1;
      module.exports.arrRole2=arr2;
    })
  })
}
module.exports.arrRole=arr;
module.exports.arrRole1=arr1;
module.exports.arrRole2=arr2;
module.exports.passport=passport;

