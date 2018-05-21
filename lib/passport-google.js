var passport = require('passport');
var encode=require("../lib/encode");
var user=require("../models/user");
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
    clientID: '372269942848-64nnpmcu4o95335taumad0p9l71corro.apps.googleusercontent.com',
    clientSecret: 'It8AilkDarQVuaF2r8blyso-',
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
          done(null,result);
        })
      }
      
    })
  }
));
passport.serializeUser(function(user, done) {
  done(null, user._id);
});
passport.deserializeUser(function(id, done) {
  user.findById(id, function(err, user) {
    done(err, user);
    }).catch(function (err) {
      console.log(err);
    });
});
