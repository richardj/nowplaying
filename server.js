// set up
var express = require('express');
var app     = express();
var mongoose = require('mongoose'); // mongoose for mongodb
var morgan = require('morgan'); // log requests to the console
var bodyParser = require('body-parser'); // pull information from HTML POST
var methodOverride = require('method-override'); // simulate DELETE and PUT



mongoose.connect('mongodb://localhost/test');

// set express static dirname because else you will get a lot of errors regarding MIME-types with the res.sendFile function
app.use(express.static(__dirname + '/public'));

app.use(express.static(__dirname + '/public'));                 // set the static files location /public/img will be /img for users
app.use(morgan('dev'));                                         // log every request to the console
app.use(bodyParser.urlencoded({'extended':'true'}));            // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                                     // parse application/json
app.use(bodyParser.json({ type: 'application/vnd.api+json' })); // parse application/vnd.api+json as json
app.use(methodOverride());



// define our Track model
var Track = mongoose.model('Track', {
  name : String,
  artist : String
});


// Routes

// get tracks
app.get('/api/tracks', function(req, res) {
  Track.find(function(err, tracks) {
    if (err) {
      res.send(err);
    }
    res.json(tracks);
  });
});


// create a track
app.post('/api/tracks', function(req, res) {
  console.log(req);
  Track.create({
    name: req.body.name,
    artist: req.body.artist['#text'],
    done: false
  }, function(err, track) {
    if (err) {
      res.send(err);
    }

    Track.find(function(err, tracks) {
      if (err) {
        res.send(err);
      }
      res.json(tracks);
    });
  });
});


// delete a track
app.delete('/api/tracks/:tracks_id', function(req,res) {
  Track.remove({
    _id : req.params.track_id
  }, function(err, track) {
      if (err) {
        res.send(err); 
      }

      Todo.find(function(err,todos) {
        if (err) {
          res.send(err);
        }
        res.json(tracks);
      });
   });
});

app.get('', function(req,res) {
  res.sendFile('html/index.html', { root: __dirname + '/public/'}); 
});


// listen (start app with node server.js)
app.listen(8080);
console.log("App listening on port 8080");
