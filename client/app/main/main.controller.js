'use strict';

angular.module('bazooKaApp')

.controller('MainCtrl', function($scope, $log, $mdToast, NumberService) {

  var winningNumber = NumberService.getRandomNumber();
  $log.debug('winning number is', winningNumber);

  $scope.attempts = 3;

  $scope.selectNumber = function(number) {

    if ($scope.form.$valid) {
      $log.debug('number selected', number);

      var winning = number == winningNumber;

      NumberService.logNumber({ value : number, winning : winning }, function() {
        $log.debug('Number logged successfully');
      }, function(err) {
        $log.error('Error logging number', err);
      });

      if (winning) {
        $scope.winnerMessage = true;
        $scope.tryAgainMessage = false;
      } else {
        $scope.tryAgainMessage = true;
        $scope.attempts--;
      }

      if ($scope.attempts == 0) {
        $scope.refreshMessage = true;
        $scope.tryAgainMessage = false;

      }

    } else {
       $scope.form.$setSubmitted(true);
    }
  };

});
