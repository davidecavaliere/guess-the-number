angular.module('bazooKaApp')
.service('NumberService', function($resource) {
  var min = 1;
  var max = 100;

  var number = Math.floor(Math.random() * (max - min) + min);

  var resource = $resource('/api/numbers/:id', { id : '@id' }, {
    save : {
      method : 'POST'
    }
  });

  return {
    getRandomNumber : function() {
      return number;
    },
    logNumber : function(number, callback, err) {
      return resource.save(number, callback, err);
    }
  }
});
