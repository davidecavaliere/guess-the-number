var logger = require('../../config/bunyan');

exports.setup = function (User, config) {
  var passport = require('passport');

  var SpotifyStrategy = require('passport-spotify').Strategy;

  passport.use(new SpotifyStrategy({
    clientID: config.spotify.clientID,
    clientSecret: config.spotify.clientSecret,
    callbackURL: config.spotify.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    logger.info('User logged in with spotify');

    User.findOneAndUpdate({
      'spotify.id': profile.id
    }, {
      $set : {
        name: profile.displayName || profile.username,
        role: 'user',
        provider: 'spotify',
        spotify: profile._json
      }
    }, {
      upsert : true, new : true
    }, function(err, user) {
      if (err) {
        return done(err);
      }
      if (!user) {
        user = new User({
          name: profile.displayName || profile.username,
          role: 'user',
          provider: 'spotify',
          spotify: profile._json
        });
        user.save(function(err) {
          if (err) return done(err);
          return done(err, user, accessToken);
        });
      } else {
        return done(err, user, accessToken);
      }
    });
  }
  ));

};
