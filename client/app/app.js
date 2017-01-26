'use strict';

angular.module('bazooKaApp', [
  'ngCookies',
  'ngResource',
  'ui.router',
  'ngMaterial',
  'pascalprecht.translate',
  'angular.filter',
  'ngAnimate',
  'ngMessages'
])
  .config(function (
      $logProvider,
      $stateProvider, $urlRouterProvider,
      $locationProvider, $httpProvider, $mdIconProvider,
      $mdThemingProvider,
      $translateProvider,
      $mdDateLocaleProvider,
      $mdToastProvider
    ) {

      // set up date formatter
      $mdDateLocaleProvider.formatDate = function(date) {
        return moment(date).format('DD/MM/YYYY');
      };

      $mdDateLocaleProvider.parseDate = function(dateString) {
        var m = moment(dateString, 'DD/MM/YYYY', true);
        return m.isValid() ? m.toDate() : new Date(NaN);
      };

    // set up translations key



    // translation sanitize security settings
    $translateProvider.useSanitizeValueStrategy('sanitizeParameters');

    // defaul language
    $translateProvider.preferredLanguage('en-GB');

    var lang = window.navigator.language || window.navigator.userLanguage;
    if (lang.indexOf('it') >= 0) {
      $translateProvider.preferredLanguage('it');
    }



    $urlRouterProvider
      .otherwise('/');

    $locationProvider.html5Mode(true);
    $httpProvider.interceptors.push('authInterceptor');

    $mdThemingProvider.theme('dark')
      .dark()
      .primaryPalette('blue-grey')

    // configuring ng-material
    $mdThemingProvider.theme('default')
      // .dark()
      .primaryPalette('blue')

    // TODO: must switch off when on live
    $logProvider.debugEnabled(true);

  })

  .factory('authInterceptor', function ($rootScope, $q, $cookieStore, $location, $log) {
    return {
      // Add authorization token to headers
      request: function (config) {
        config.headers = config.headers || {};
        if ($cookieStore.get('token')) {
          config.headers.Authorization = 'Bearer ' + $cookieStore.get('token');
        }

        return config;
      },

      // Intercept 401s and redirect you to login
      responseError: function(response) {
        if(response.status === 401) {
          var url = $location.url();

          var allowed = ['/', '/login', '/signup'];
          $log.debug('$location', url);
          if (allowed.indexOf(url) < 0)
            $location.path('/');

          // remove any stale tokens
          $cookieStore.remove('token');
          return $q.reject(response);
        }
        else {
          return $q.reject(response);
        }
      }
    };
  })

  .constant('version', '0.7')

  .run(function ($rootScope, $location, Auth, $state) {

    function Authorize(event, next) {



      if ($location.host() === '172.17.0.4' && false) {
        console.log('auto login user');
        Auth.login({
          email : 'admin@admin.com',
          password  : 'admin'
        })
      } else if (next.authenticate) {
        return Auth.isLoggedInAsync(function(loggedIn) {

          if (!loggedIn) {
            event.preventDefault();
            $state.go('login', { requestedState : next.name });
          }
        });
      }

    };

    // Redirect to login if route requires auth and you're not logged in
    $rootScope.$on('$stateChangeStart', Authorize);


    $rootScope.$on('$routeChangeSuccess', function(newRoute, oldRoute) {
        $location.hash($routeParams.scrollTo);
        $anchorScroll();
    });
  });
