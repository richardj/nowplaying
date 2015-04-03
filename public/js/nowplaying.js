angular.module('nowplaying', [])
.controller('mainController', function($scope, $http) {
  $scope.formData = {};

  $http.get('/api/tracks')
    .success(function(data) {
      console.log(data);
      $scope.tracks = data;
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });

    this.createTrack = function(track) {
      console.log(track.name);

      $http.post('/api/tracks', track)
        .success(function(data) {
          //$scope.formData = {}; // clears form
          $scope.tracks = data;
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };

    this.deleteTrack = function() {
      $http.delete('/api/tracks/' + id)
        .success(function(data) {
          $scope.tracks = data;
          console.log(data);
        })
        .error(function(data) {
          console.log('Error ' + data);
        });
    };
})
.directive('getPlay', function($http) {
  return {
    restrict: 'A',
    controller: 'mainController',
    link: function(scope, element, attrs, controller) {
      scope.getData = function() {
        var user = scope.username;
        var baseUrl = "http://ws.audioscrobbler.com/2.0/";
        var method = "?method=user.getrecenttracks&user=";
        var key = "b2917a358f8427be7ab7f00adb263ffd";
        var format = "json";
        var limit = 1;
        var error = false;
        var get = baseUrl + method + "&user=" + user + "&api_key=" + key + "&format=" + format + "&limit=" + limit;
        var track = {};
        var backgroundElement = document.getElementById('trans');

        scope.loading = true;
        
        $http.get(get).
        success(function(data, status, headers, config) {
          scope.loading = false;
          if (typeof data.recenttracks !== 'undefined') {
            // last.fm api sends back an object when setting limit to 1 for when you currently play something
            // if not it will send an Array, fix is to set limit to two, but i don't need that right now so will use this approach
            if (data.recenttracks.track instanceof Array) {
              track = data.recenttracks.track[0];
            }
            else {
              track = data.recenttracks.track; 
            }
          
            backgroundElement.style.backgroundImage = "url(" + track.image[3]['#text'] + ")";
            scope.track = track;
            controller.createTrack(track);
          }
          else {
            // errorrrr
            scope.error = data;
          }
        }).
        error(function(data, status, headers, config) {
          console.log(status);
        });
      };
     }
  };
});
