'use strict';

var path = require('path');
var _ = require('lodash');

function requiredProcessEnv(name) {
  if(!process.env[name]) {
    throw new Error('You must set the ' + name + ' environment variable');
  }
  return process.env[name];
}

// All configurations will extend these options
// ============================================
var all = {
  env: process.env.NODE_ENV,

  // Root path of server
  root: path.normalize(__dirname + '/../../..'),

  // Server port
  port: process.env.PORT || 9000,

  // Should we populate the DB with sample data?
  seedDB: false,

  // Secret for session, you will want to change this and make it an environment variable
  secrets: {
    session: 'bazoo-ka-secret'
  },

  // List of user roles
  userRoles: ['guest', 'user', 'admin'],

  // MongoDB connection options
  mongo: {
    options: {
      db: {
        safe: true
      }
    }
  },

  twitter: {
    clientID:     process.env.TWITTER_ID || 'id',
    clientSecret: process.env.TWITTER_SECRET || 'secret',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/twitter/callback'
  },

  google: {
    clientID:     process.env.GOOGLE_ID || '150393701151.project.googleusercontent.com',
    clientSecret: process.env.GOOGLE_SECRET || 'qsJIYFXOqMZ9wUQoivCcGR9C',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/google/callback'
  },

  spotify: {
    clientID:     process.env.SPOTIFY_ID || 'c5770f45d1a6426f8cc7829c3601b8b8',
    clientSecret: process.env.SPOTIFY_SECRET || 'e9d0de28eaa440d981cc74f1c9cf25e8',
    callbackURL:  (process.env.DOMAIN || '') + '/auth/spotify/callback'
  }
};

// Export the config object based on the NODE_ENV
// ==============================================
module.exports = _.merge(
  all,
  require('./' + process.env.NODE_ENV + '.js') || {});
