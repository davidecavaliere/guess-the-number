'use strict';

angular.module('bazooKaApp')

.controller('MainCtrl', function($scope, $log, $mdToast) {

  $scope.selectNumber = function(number) {

    if ($scope.form.$valid) {
      $log.debug('number selected', number);

    } else {
       $scope.form.$setSubmitted(true);
    }
  };

});
