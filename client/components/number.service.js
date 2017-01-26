angular.module('bazooKaApp')
.service('NumberService', function() {
  var min = 1;
  var max = 100;

  var number = Math.floor(Math.random() * (max - min) + min);

  return {
    getRandomNumber : function() {
      return number;
    }
  }
});
