'use strict';

angular.module('bazooKaApp')
  .directive('dcToolbar', function($log) {
    return {
      templateUrl : 'components/navbar/navbar.html',
      controller : 'NavbarCtrl',
      transclude : true
    }
  })
  .directive('ngAllowTab', function () {
    return function (scope, element, attrs) {
      element.bind('keydown', function (event) {
        if (event.which == 9) {
          event.preventDefault();
          var start = this.selectionStart;
          var end = this.selectionEnd;
          element.val(element.val().substring(0, start)
          + '    ' + element.val().substring(end));
          this.selectionStart = this.selectionEnd = start + 1;
          element.triggerHandler('change');
        }
      });
    };
  })
  .directive('fillHeight', function($log, $window) {

    function calculateAvailableHeight(e) {
      //$log.debug('----------------------------');
      var elementTop = e.offset().top;
      //$log.debug('element top is', elementTop);
      var windowHeight = $window.innerHeight;
      //$log.debug('windowHeight', windowHeight);
      var availableHeight = windowHeight - elementTop;
      //$log.debug('availableHeight', availableHeight);

      var parent = e.parent();
      //$log.debug('parent', parent);
      var pHeight = parent.innerHeight();
      //$log.debug('parent height', pHeight);

      var brothers = e.siblings();
      //$log.debug('brothers', brothers);

      var shrinkingToolBar = e.siblings('[md-scroll-shrink]');
      //$log.debug('shinking toolbar', shrinkingToolBar[0]);

      if (shrinkingToolBar[0]) {
        // TODO:
        // IMPORTANT:
        // this is just to fix a display issue
        return availableHeight;
      }

      // $log.debug('siblings', brothers);
      var brothersHeight = 0;

      angular.forEach(brothers, function(brother) {

        if($(brother)!=e) {
          // $log.info('brother height', brother);
          brothersHeight += $(brother).height();
        }
      });

      // $log.info('brothers height', brothersHeight);

      return pHeight - brothersHeight;
    }

    return {
      restrict : 'A',
      link : function(s, e, a) {
        // $log.info('element', e);
        // $log.info('parent', e.parent());
        var extraPadding = a.fillHeight || 0;

        e.height(calculateAvailableHeight(e) - extraPadding);

        e.on('scroll', function() {
          e.height(calculateAvailableHeight(e) - extraPadding);

        })

        s.$on('repaint-request', function() {
          // $log.info('Resize Event');
          e.height(calculateAvailableHeight(e) - extraPadding);
        });

      }
    }
  })
  .controller('NavbarCtrl', function (
    $log, $scope, $location, Auth, $mdSidenav, translateFilter) {
    var t = translateFilter;

    $scope.isCollapsed = true;
    $scope.isLoggedIn = Auth.isLoggedIn();
    $scope.toggleMenu = function() {
      $mdSidenav('left').toggle();
    };

    $scope.toggleMenu = function() {
      $mdSidenav('left').toggle();
    };

    $scope.menu = [{
      link : '/',
      state : 'main',
      title : t('Home'),
      icon : 'home'
    }, {
      link : '/admin',
      state : 'admin',
      title : t('Admin'),
      icon : 'settings'
    }, {
      link : '/vouchers',
      state : 'vouchers',
      title : t('Documents'),
      icon : 'description'
    }];


  })
;
