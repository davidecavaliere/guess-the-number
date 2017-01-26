/* global io */
'use strict';

angular.module('bazooKaApp')
  .service('RoomApi', function($resource) {
    return $resource('/api/rooms', {});
  })
  .service('RoomService', function(socket, $log, RoomApi, $q, Auth) {
    // TODO: possible memory leak point
    var scopes = [];
    var rooms = [];



    // so ugly!
    var io = socket.socket;

    // First thing we get all the rooms I've joined
    // get all the room for the current logged in user
    io.emit('room:find', {
        $or : [
          {'owner.name' : Auth.getCurrentUser().name},
          // {users : { $elmMatch : { name : Auth.getCurrentUser().name } } }
        ]
    });

    io.on('room:find', function(docs) {
      $log.debug('Got rooms ', docs);
      rooms = docs;
      $log.debug('scanning scopes', scopes);
      scopes.forEach(function(sc) {
        sc.rooms = rooms;
        $log.debug('apply to ', sc);
        // sc.$apply();
      });
    });

    io.on('room:join', function(room) {

        // TODO: please don't do this to me
        // inject say function into the new room
        room.say = function(message) {
          room.messages.unshift(message);
          io.emit('message', {room : room, message : message});
        };

        $log.debug('adding room to rooms', room, rooms);

        angular.forEach(rooms, function(r) {
          if (r._id === room._id) {
            r = room;
          } else {
            rooms.push(room);
          }
        });

        scopes.forEach(function(sc) {
          sc.rooms = rooms;
        });
    });

    io.on('room:message', function(obj) {
      $log.debug('Got message', obj);
      var r = obj.room;
      var message = obj.message;

      // TODO: create lookup mechanism
      angular.forEach(rooms, function(room) {
        if (room.name === r.name) {
          room.messages.unshift(message);
        }
      });
    });


    return {
      /**
       * Joins a Room
       * The room is created if it doesn't exist
       * @param {room} the room object
       */
       join : function(room, user) {
         io.emit('room:join', room, user);
       },
       /**
        * Get the list of all the rooms
        * @return array
        */
        getRooms : function(scope) {
          scopes.push(scope);
          return rooms;
        }
      };
  })
  .factory('socket', function(socketFactory, $location, $log, Auth) {

    //$log.info('is this rhcloud?', $location.$$host.indexOf('rhcluod'));

    var port = '';

    if ($location.$$port === 80 && $location.$$host.indexOf('rhcloud') >= 0) {
      port = ':8000';
    }

    // socket.io now auto-configures its connection when we ommit a connection url
    var ioSocket = io('' + port, {
      // Send auth token on connection, you will need to DI the Auth service above
      // 'query': 'token=' + Auth.getToken()
      path: '/socket.io-client',
      transports : ['websocket'],
      query : 'user=' + JSON.stringify(Auth.getCurrentUser())
    });

    ioSocket.on('connect', function() {
      $log.info('socket - connect');
    });

    ioSocket.on('connect_error', function(err) {
      $log.error('socket error: ', err);
    });

    var socket = socketFactory({
      ioSocket: ioSocket
    });

    socket.on('connect', function() {
      $log.info('Connected', this);
    });

    socket.on('global', function(global) {
      $log.info('Global', global);
    });
    socket.forward('error');

    return {
      socket: socket,

      /**
       * Register listeners to sync an array with updates on a model
       *
       * Takes the array we want to sync, the model name that socket updates are sent from,
       * and an optional callback function after new items are updated.
       *
       * @param {String} modelName
       * @param {Array} array
       * @param {Function} cb
       */
      syncUpdates: function (modelName, array, cb) {
        cb = cb || angular.noop;

        /**
         * Syncs item creation/updates on 'model:save'
         */
        socket.on(modelName + ':save', function (item) {
          var oldItem = _.find(array, {_id: item._id});
          var index = array.indexOf(oldItem);
          var event = 'created';

          // replace oldItem if it exists
          // otherwise just add item to the collection
          if (oldItem) {
            array.splice(index, 1, item);
            event = 'updated';
          } else {
            array.push(item);
          }

          cb(event, item, array);
        });

        /**
         * Syncs removed items on 'model:remove'
         */
        socket.on(modelName + ':remove', function (item) {
          var event = 'deleted';
          _.remove(array, {_id: item._id});
          cb(event, item, array);
        });
      },

      /**
       * Removes listeners for a models updates on the socket
       *
       * @param modelName
       */
      unsyncUpdates: function (modelName) {
        socket.removeAllListeners(modelName + ':save');
        socket.removeAllListeners(modelName + ':remove');
      },
      /**
       * Send a stream to the socket server
       * Similar to send but here we can specify the
       * event name.
       *
       * The given event should be specified to the
       * <model>.socket.js file in order
       *
       * @param  {string}  event the event name i.e.:
       *   'document:add_attachment'
       * @param  {file}    the file to upload
       * @param {Object}   metadata object
       * @param {Function} callback executed when the socket
       *   server emits the <event>_finished event. Such as:
       *   // TODO obj is not defined yet. see document.socket.js
       *    socket.sendStream('document:add_attachment', file, metadata, function(obj) {
       *    	// here the sever emitted the 'document:add_attachment_finished' event
       *    })
       *
       */
      sendStream : function(event, file, metadata, onFinish) {
        var _ss = ss;

        metadata = angular.extend(metadata || {}, {
          name : file.name,
          size : file.size,
          type : file.type
        });

        var stream = _ss.createStream();

        // upload a file to the server.
        _ss(socket).emit(event, stream, metadata);
        _ss.createBlobReadStream(file).pipe(stream);

        socket.once(event + '_finished', function(file) {
          $log.debug('got', event + '_finished', file);
          angular.isFunction(onFinish) && onFinish.apply(null, [file]);
        });

        return stream;

      },
      /**
       * Send a Stream to the server
       *
       * @param {file} the file to upload
       * @param {Object} metadata
       */
      send : function(file, metadata) {
        this.sendStream('stream', file, metadata);
      },
      /**
       * Request a Stream from the server
       *
       * @param {fileId} the file to upload
       * @param {Object} metadata
       */
       getStream : function(fileId, cb) {
         var _ss = ss;

         _ss(socket).emit('requestFile', fileId);
         _ss(socket).on('file', function(stream) {
           cb(stream);
         });

       }
    };
  });
