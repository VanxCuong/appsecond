var user=require("../models/user");
var role=require("../models/role");
var roleUser=require("../models/roleUser");
var RouterRole=require("../models/RouterRole");
var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy;
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy,
    FacebookStrategy = require('passport-facebook').Strategy;
var encode=require("../lib/encode");
var key=require("../lib/key");
var bcrypt=require("bcryptjs");

/**
 * Login Facebook
 */
  passport.use(new FacebookStrategy({
    clientID: key.FACEBOOK_API_ID,
    clientSecret: key.FACEBOOK_API_SECRET,
    callbackURL: "https://3e7575c5.ngrok.io/auth/facebook/redirect",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, done) {
    var email=profile.emails[0].value,
        fullname=profile.displayName,
        password=encode.hash_password(profile.id),
        facebookID=profile.id;
    var data={
      email:email,
      fullname:fullname,
      password:password,
      facebookID:facebookID
    }
    user.findOne({email:email}).then(result=>{
      if(result!==null){
        done(null,result)
      }else{
        var createUser=new user(data);
        createUser.save((err,result)=>{
          findIdRole(idRole=>{
            var dl=new roleUser({
              user_id:createUser._id,
              role_id:idRole
            })
            dl.save((err,kq)=>{
              if(err){
                done(null, false, { message: 'Không thể truy cập được email này.' });
              }
              done(null,createUser);
            })
          })
          
        })
      }
    }).catch(err=>{
      console.log(err);
      
    })
    
  }
  ));

/**
 * Login Google
 */


passport.use(new GoogleStrategy({
    clientID: key.GOOGLE_API_ID,
    clientSecret: key.GOOGLE_API_SECRET,
    callbackURL: "/auth/google/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
    var email=profile.emails[0].value,
        fullname=profile.displayName,
        password=encode.hash_password(profile.id),
        googleId=profile.id;
    var data={
      email:email,
      fullname:fullname,
      password:password,
      googleId:googleId
    }
    
    user.findOne({email:email}).then(result=>{
      if(result!==null){
        done(null,result)
      }else{
        var createUser=new user(data);
        createUser.save((err,result)=>{
          findIdRole(idRole=>{
            var dl=new roleUser({
              user_id:createUser._id,
              role_id:idRole
            })
            dl.save((err,kq)=>{
              if(err){
                done(null, false, { message: 'Không thể truy cập được email này.' });
              }
              done(null,createUser);
            })
          })
          
        })
      }
    }).catch(err=>{
      console.log(err);
      
    })
  }
));

/**
 * Login tự động bằng Emaikl
 */
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
  console.log(user._id);
  
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
        console.log(k);
        
      }).catch(err=>{
        console.log(err);
        
      });
      module.exports.arrRole=arr;
      module.exports.arrRole1=arr1;
      module.exports.arrRole2=arr2;
    })
  }).catch(err=>{
    console.log(err);
    
  })
}
var findIdRole=cb=>{
  role.findOption({name:"Thính Giả"}).then(value=>{
    cb(value[0]._id);
  })
}
module.exports.arrRole=arr;
module.exports.arrRole1=arr1;
module.exports.arrRole2=arr2;
module.exports.passport=passport;


