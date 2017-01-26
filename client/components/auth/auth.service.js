'use strict';

angular.module('bazooKaApp')
  .factory('Auth', function Auth(
$log,
$location, $rootScope, $http, User, $cookieStore, $q) {

    var currentUser = $q.defer();

    User.get(function(user) {
      currentUser.resolve(user);
    }, function(err) {
      $log.error('user is not logged in', err);
      currentUser.reject(err);

    })

    if($cookieStore.get('token')) {
      $log.debug('jwt is ', $cookieStore.get('token'));
      // currentUser.resolve(User.get());
    }

    return {

      /**
       * Authenticate user and save token
       *
       * @param  {Object}   user     - login info
       * @return {Promise}
       */
      login: function(user) {
        currentUser = $q.defer();

        $http.post('/auth/local', {
          email: user.email,
          password: user.password
        }).
        success(function(data) {
          $cookieStore.put('token', data.token);
          User.get(function(user) {
            currentUser.resolve(user);
          });

        }).
        error(function(err) {
          currentUser.reject(err);
          this.logout();
        }.bind(this));
        $log.debug('returning promise', currentUser.promise);
        return currentUser.promise;
      },

      /**
       * Delete access token and user info
       *
       * @param  {Function}
       */
      logout: function() {
        $cookieStore.remove('token');
        currentUser = $q.defer();
        currentUser.reject('not logged in');
      },

      /**
       * Create a new user
       *
       * @param  {Object}   user     - user info
       * @param  {Function} callback - optional
       * @return {Promise}
       */
      createUser: function(user, callback) {
        var cb = callback || angular.noop;

        return User.save(user,
          function(data) {

            debugger;
            $cookieStore.put('token', data.token);
            currentUser.resolve(data.user);
            return cb(data.user);
          },
          function(err) {
            this.logout();
            return cb(err);
          }.bind(this)).$promise;
      },

      /**
       * Change password
       *
       * @param  {String}   oldPassword
       * @param  {String}   newPassword
       * @param  {Function} callback    - optional
       * @return {Promise}
       */
      changePassword: function(oldPassword, newPassword, callback) {
        var cb = callback || angular.noop;

        return User.changePassword({ id: currentUser._id }, {
          oldPassword: oldPassword,
          newPassword: newPassword
        }, function(user) {
          return cb(user);
        }, function(err) {
          return cb(err);
        }).$promise;
      },

      /**
       * Gets all available info on authenticated user
       *
       * @return {Object} user
       */
      getCurrentUser: function() {
        return currentUser.promise;
      },

      /**
       * Check if a user is logged in
       *
       * @return {Boolean}
       */
      isLoggedIn: function() {
        $log.debug('checking if user is logged in', !!$cookieStore.get('token'));
        return !!$cookieStore.get('token');
      },

      /**
       * Waits for currentUser to resolve before checking if user is logged in
       * TODO: we shall rely on socket or (if socket fails) or rest api to get the user
       * using $q and and the first if.
       */
      isLoggedInAsync: function(cb) {

        User.get(function() {
          cb(true);
        }, function() {
          cb(false);
        });
      },

      /**
       * Check if a user is an admin
       *
       * @return {Boolean}
       */
      isAdmin: function() {
        return currentUser.role === 'admin';
      },

      /**
       * Get auth token
       */
      getToken: function() {
        return $cookieStore.get('token');
      }
    };
  });
