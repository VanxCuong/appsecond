var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
passport.use(new GoogleStrategy({
    clientID: '372269942848-64nnpmcu4o95335taumad0p9l71corro.apps.googleusercontent.com',
    clientSecret: 'It8AilkDarQVuaF2r8blyso-',
    callbackURL: "/auth/google/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
       console.log(profile);
       
  }
));
