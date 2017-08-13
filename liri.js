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

		console.log("###############################################\r\n");//log seperator for readability

		console.log(//log pertinent details from OMDB JSON
	  	  "Movie Title: " + cleanResponse.Title + "\r\n" +
		  "Year: " + cleanResponse.Year + "\r\n" +
		  "IMDB Rating: " + cleanResponse.Ratings[0].Value + "\r\n" + 
		  "Rotton Tomoatoes Rating: " + cleanResponse.Ratings[1].Value + "\r\n" +
		  "Country: " + cleanResponse.Country + "\r\n" +
		  "Language: " + cleanResponse.Language + "\r\n" +
		  "Plot: " + cleanResponse.Plot + "\r\n" +
		  "Actors/Actresses: " + cleanResponse.Actors + "\r\n"
		);

	  	console.log("###############################################");//log seperator for readability

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
	  .search({ type: 'track', query: songArray.join(" "), limit: 1 })
	  .then(function(response) {

	  	var path = response.tracks.items[0];

	console.log("###############################################\r\n");//log seperator for readability

		console.log(//log pertinent details from OMDB JSON
	  	  "Artist(s): " + path.artists[0].name + "\r\n" +
		  "Song Name: " + path.name + "\r\n" +
		  "Preview Link: " + path.href + "\r\n" +
		  "Album: " + path.album.name + "\r\n"

		);

	console.log("###############################################");//log seperator for readability

	});

};

//---------------------------------------------------------------