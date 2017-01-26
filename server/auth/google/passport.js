var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

exports.setup = function (User, config) {
  passport.use(new GoogleStrategy({
      clientID: config.google.clientID,
      clientSecret: config.google.clientSecret,
      callbackURL: config.google.callbackURL
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOneAndUpdate({
        'google.id': profile.id
      }, {
        $set : {
          name: profile.displayName,
          email: profile.emails[0].value,
          role: 'user',
          username: profile.username,
          provider: 'google',
          avatar : profile.photos ? profile.photos[0].value : ''
        }
      }, {
        upsert : true, new : true
      }, function(err, user) {
          if (err) return done(err);
          return done(err, user);
      });
    }
  ));
};
