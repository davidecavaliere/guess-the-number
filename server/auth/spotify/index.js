'use strict';

var express = require('express');
var passport = require('passport');
var auth = require('../auth.service');

var router = express.Router();

router
  .get('/', passport.authenticate('spotify', {
    scope : ['user-read-email', 'user-read-private', 'user-library-read'],
    failureRedirect: '/signup',
    session: false
  }))

  .get('/callback', passport.authenticate('spotify', {
    failureRedirect: '/signup',
    session: false
  }), auth.setTokenCookie);

module.exports = router;
