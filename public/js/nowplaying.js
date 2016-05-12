angular.module('nowplaying', [])
.factory('musicService', function($http) {
  return {
    getUsers: function(url) {
      return $http({
        url: url,
        method: 'GET'
      }).then(
        function(response) {
          return response.data;
        },
        function(error) {
          console.log(error.data); 
        });
    },
    getTrackInformation: function(url) {
      return $http({
        url: url,
        method: 'GET'
      }).then(
        function(response) {
          return response;
        },
        function(error) {
          console.log(error);
        }
      );
    }
  }
})
.controller('mainController', ['$scope', '$http', 'musicService', function($scope, $http, musicService) {
  var self = this;

  self.getUsers = function(username) {
    $scope.username = username;
    var user = username;
    var baseUrl = "http://ws.audioscrobbler.com/2.0/";
    var method = "?method=user.getfriends";
    var key = "b2917a358f8427be7ab7f00adb263ffd";
    var format = "json";
    var limit = 1;
    var error = false;
    var get = baseUrl + method + "&user=" + user + "&api_key=" + key + "&format=" + format + "&recenttracks=1";

    $scope.loading = true;

    musicService.getUsers(get)
    .then(function(data) {
      $scope.loading = false;

      if (data !== undefined) {
        var users = [];

        // remove useless results
        // else it will fuck up our styling
        for (var i = 0; i < data.friends.user.length; i++) {
          if (data.friends.user[i].recenttrack) {
            users.push(data.friends.user[i]); 
          }
        }
        $scope.users = users;
      }
      else {
        console.log("Couldn't get the stories");
      }
    })
  };

  self.createPlaylist = function(users) {
    var userList = users;
    var artists = [];
    var track = {};

    var baseUrl = "https://api.spotify.com";
    var q = "/v1/search?q=";
    var type = "&type=track";
    var url;
    var tracklist = [];

    for (var i = 0; i < userList.length; i++) {
      /*
      artists.push({
        artist:  userList[i].recenttrack.artist.name,
        name: userList[i].recenttrack.name
      });
      */
      artists.push(userList[i].recenttrack.name);
    }

    //url = baseUrl + q + artists[2].name + type;

    var musicPromise = function() {
     url = baseUrl + q + artists.name + type;
    console.log(url);
     return musicService.getTrackInformation(url)
      .then(function(data) {
        tracklist.push(data);
      },
      function(error) {
        console.log(error)
      });
    };

    var actions = artists.map(musicPromise);
    var results = Promise.all(actions);

    results.then(console.log(results));
  };

  self.getWeeklyTrack = function() {
    var user = $scope.username;
    var baseUrl = "http://ws.audioscrobbler.com/2.0/";
    var method = "?method=user.getfriends";
    var key = "b2917a358f8427be7ab7f00adb263ffd";
    var format = "json";
    var limit = 1;
    var error = false;
    var get = baseUrl + method + "&user=" + user + "&api_key=" + key + "&format=" + format + "&recenttracks=1";
  };

  
  /*
  $http.get('/api/tracks')
    .success(function(data) {
      var dataRev = data.reverse();
      $scope.tracks = dataRev;

      document.getElementById('trans').style.backgroundImage = "url(" +  dataRev[0].track.image[3]['#text'] + ")";
    })
    .error(function(data) {
      console.log('Error: ' + data);
    });
      
    self.createTrack = function(track) {
      $http.post('/api/tracks', track)
        .success(function(data) {
          var dataRev = data.reverse();
          $scope.tracks = dataRev;
          document.getElementById('trans').style.backgroundColor = "red";
        })
        .error(function(data) {
          console.log('Error: ' + data);
        });
    };

    self.deleteTrack = function() {
      $http.delete('/api/tracks/' + id)
        .success(function(data) {
          $scope.tracks = data;
          console.log(data);
        })
        .error(function(data) {
          console.log('Error ' + data);
        });
    };
    */
    // update the background image 
    self.updateBackground = function(url) {
      var background = document.getElementById('trans');
      background.style.backgroundImage = "url(" + url + ")";
    };
}])
/*
.directive('getPlay', function($http) {
  return {
    restrict: 'A',
    controller: 'mainController',
    link: function(scope, element, attrs, controller) {
      scope.getData = function() {
        var user = scope.username;
        var baseUrl = "http://ws.audioscrobbler.com/2.0/";
        var method = "?method=user.getfriends";
        var key = "b2917a358f8427be7ab7f00adb263ffd";
        var format = "json";
        var limit = 1;
        var error = false;
        var get = baseUrl + method + "&user=" + user + "&api_key=" + key + "&format=" + format + "&recenttracks=1";
        var track = {};

        console.log(get);

        scope.loading = true;
        
        
        
        
         
        $http.get(get).
        success(function(data, status, headers, config) {
          console.log(data);
          scope.loading = false;
          if (typeof data.recenttracks !== 'undefined') {
            scope.error = false;
            // last.fm api sends back an object when setting limit to 1 for when you currently play something
            // if not it will send an Array, fix is to set limit to two, but i don't need that right now so will use this approach
            if (data.recenttracks.track instanceof Array) {
              track = data.recenttracks.track[0];
            }
            else {
              track = data.recenttracks.track; 
            }
          
            controller.updateBackground(track.image[3]['#text']);
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
})
*/

