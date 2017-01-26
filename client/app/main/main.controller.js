'use strict';

angular.module('bazooKaApp')

.controller('MainCtrl', function($scope, $log, $mdToast, NumberService) {

  var winningNumber = NumberService.getRandomNumber();
  $log.debug('winning number is', winningNumber);

  $scope.attemps = 3;

  $scope.selectNumber = function(number) {

    if ($scope.form.$valid) {
      $log.debug('number selected', number);

      if (number == winningNumber) {
        $scope.winnerMessage = true;
        $scope.tryAgainMessage = false;
      } else {
        $scope.tryAgainMessage = true;
        $scope.attemps--;
      }

      if ($scope.attemps == 0) {
        $scope.refreshMessage = true;
        $scope.tryAgainMessage = false;

      }

    } else {
       $scope.form.$setSubmitted(true);
    }
  };

});
