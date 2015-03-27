angular.module('nowplaying', [])
.directive('getPlay', function($http) {
  return {
    link: function(scope, element, attrs) {
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
          console.log(data);
          scope.loading = false;
          if (typeof data.recenttracks !== 'undefined') {
            if (data.recenttracks.track instanceof Array) {
              track = data.recenttracks.track[0];
            }
            else {
              track = data.recenttracks.track; 
            }
          
            backgroundElement.style.backgroundImage = "url(" + track.image[3]['#text'] + ")";
            scope.track = track;
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
