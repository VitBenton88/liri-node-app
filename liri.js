var keys = require("./keys.js");
var request = require('request');

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

//---------------------------------------------------------------

//OMDB_API:

if (position2 == "movie-this"){//when the movie command is executed ...

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
		  ratingIMDB: cleanResponse.Ratings[0].Value,
		  ratingRT: cleanResponse.Ratings[1].Value,
		  country: cleanResponse.Country,
		  language: cleanResponse.Language,
		  plot: cleanResponse.Plot,
		  actors: cleanResponse.Actors,
		}

	  	console.log(movie);//log to console movie object

	});

};

