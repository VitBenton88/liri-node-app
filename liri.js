var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');

//twitter keys:
var twitterConsumerKey = keys.twitterKeys.consumer_key;
var twitterConsumerSecret = keys.twitterKeys.consumer_secret;
var twitterAccessTokenKey = keys.twitterKeys.access_token_key;
var twitterAccessTokenSecret = keys.twitterKeys.access_token_secret;

//spotify keys:
var spotConsumerKey = keys.spotifyKeys.client_id;
var spotConsumerSecret = keys.spotifyKeys.client_secret;

//command line positions:
var position2 = process.argv[2];
var position3 = process.argv[3];
var position4 = process.argv[4];

//command keywords:
var movieCommand = 'movie-this';
var songCommand = 'spotify-this-song';
var twitterCommand = 'my-tweets';
var doCommand = 'do-what-it-says';

//---------------------------------------------------------------

//OMDB_API:

if (position2 == movieCommand){//when the movie command is executed ...

	var titleArray = [];

	for (var i = 3; i < process.argv.length; i++) {//loop through all posiitons to collect title, if title > one word
		titleArray.push(process.argv[i]);
	}

	var queryURL = "http://www.omdbapi.com/?t=" + titleArray.join(" ") + "&y=&plot=short&apikey=40e9cece";//API query URL

	request(queryURL, function (error, response, body) {//reuqest API query URL

		var cleanResponse = JSON.parse(body);//convert body to object

		var movie = { // collect necessary values from JSON
	  	  title: cleanResponse.Title,
		  year: cleanResponse.Year,
		  rating_IMDB: cleanResponse.Ratings[0].Value,
		  rating_RottonTomoatoes: cleanResponse.Ratings[1].Value,
		  country: cleanResponse.Country,
		  language: cleanResponse.Language,
		  plot: cleanResponse.Plot,
		  actors: cleanResponse.Actors,
		}

	  	console.log(movie);//log to console movie object

	});

};

//---------------------------------------------------------------

//SPOTIFY:

if (position2 == songCommand){//when the movie command is executed ...

	var songArray = [];

	for (var i = 3; i < process.argv.length; i++) {//loop through all posiitons to collect title, if title > one word
		songArray.push(process.argv[i]);
	}

	var spotify = new Spotify({
	  id: spotConsumerKey,
	  secret: spotConsumerSecret,
	});

	spotify
	  .search({ type: 'track', query: songArray.join(" ") })
	  .then(function(response) {

	// var song = { // collect necessary values from JSON
 //  	  title: response.Title,
	//   year: response.Year,
	//   rating_IMDB: response.Ratings[0].Value,
	//   rating_RottonTomoatoes: response.Ratings[1].Value,
	//   country: response.Country,
	//   language: response.Language,
	//   plot: response.Plot,
	//   actors: response.Actors,
	// }

	  	console.log(response);//log to console movie object

	});

};

//---------------------------------------------------------------