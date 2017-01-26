/**
 * Socket.io configuration
 */

'use strict';

var logger = require('./bunyan');
var config = require('./environment');

var mongoose = require('mongoose');



var globalVariable = {
  connectedClients : 0
}

// When the user disconnects.. perform this
function onDisconnect(socket) {
}

// When the user connects.. perform this
function onConnect(socket) {

  // When the client emits 'info', this listens and executes
  socket.on('info', function (data) {
    logger.info('[%s] %s', socket.address, JSON.stringify(data, null, 2));
  });

  // Insert sockets below
  require('../api/number/number.socket').register(socket);
  require('../api/thing/thing.socket').register(socket);
  require('../api/user/user.socket').register(socket);
}

module.exports = function (socketio) {
  // socket.io (v1.x.x) is powered by debug.
  // In order to see all the debug output, set DEBUG (in server/config/local.env.js) to including the desired scope.
  //
  // ex: DEBUG: "http*,socket.io:socket"

  // We can authenticate socket.io users and access their token through socket.handshake.decoded_token
  //
  // 1. You will need to send the token in `client/components/socket/socket.service.js`
  //
  // 2. Require authentication here:
  // socketio.use(require('socketio-jwt').authorize({
  //   secret: config.secrets.session,
  //   handshake: true
  // }));

  socketio.on('connection', function (socket) {

    logger.debug('query', socket.handshake.query.user);

    socket.user = socket.handshake.query.user;

    logger.debug('user', socket.user);


    socket.address = socket.handshake.address !== null ?
            socket.handshake.address.address + ':' + socket.handshake.address.port :
            process.env.DOMAIN;

    socket.connectedAt = new Date();

    // Call onDisconnect.
    socket.on('disconnect', function () {
      onDisconnect(socket);
      logger.info('[%s] DISCONNECTED', socket.id);
    });

    // Call onConnect.
    onConnect(socket);
    logger.info('CONNECTED', socket.id);

  });
};
