var keys = require("./keys.js");
var request = require('request');
var Spotify = require('node-spotify-api');
var Twitter = require('twitter');
var fs = require("fs");

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

//command keywords:
var movieCommand = 'movie-this';
var songCommand = 'spotify-this-song';
var twitterCommand = 'my-tweets';
var doCommand = 'do-what-it-says';

//---------------------------------------------------------------

//OMDB:

if (position2 == movieCommand){//when the movie command is executed ...

	var titleArray = [];
	var movieTitle = "";

	for (var i = 3; i < process.argv.length; i++) {//loop through all posiitons to collect title, if title > one word
		titleArray.push(process.argv[i]);
		movieTitle = titleArray.join(" ");
	}

	var queryURL = "";//API query URL

	if (movieTitle == ""){//If no movie title is provided then search the title 'Mr.Nobody'.

		queryURL = "http://www.omdbapi.com/?t=Mr.Nobody&y=&plot=short&apikey=40e9cece";
	}

	else {

		queryURL = "http://www.omdbapi.com/?t=" + movieTitle + "&y=&plot=short&apikey=40e9cece";

	};

	request(queryURL, function (error, response, body) {//reuqest API query URL

		var cleanResponse = JSON.parse(body);//convert body to object

		var rottonTomoatoesRating = "";

		if (cleanResponse.Ratings.length > 1){//not all movies have a Rotton Tomatoes rating, this if statement checks for that to avoid an error

			rottonTomoatoesRating = cleanResponse.Ratings[1].Value;
		}

		else {

			rottonTomoatoesRating = "Unavailable";
		};

		 console.log("###############################################\r\n");//log seperator for readability

			console.log(//log pertinent details from OMDB JSON
		  	  "Movie Title: " + cleanResponse.Title + "\r\n" +
			  "Year: " + cleanResponse.Year + "\r\n" +
			  "IMDB Rating: " + cleanResponse.Ratings[0].Value + "\r\n" + 
			  "Rotton Tomoatoes Rating: " + rottonTomoatoesRating + "\r\n" +
			  "Country: " + cleanResponse.Country + "\r\n" +
			  "Language: " + cleanResponse.Language + "\r\n" +
			  "Plot: " + cleanResponse.Plot + "\r\n" +
			  "Actors/Actresses: " + cleanResponse.Actors + "\r\n"
			);

		  	console.log("###############################################");//log seperator for readability

	});

}

//---------------------------------------------------------------

//SPOTIFY:

else if (position2 == songCommand){//when the movie command is executed ...

	var songArray = [];
	var song = "";

	for (var i = 3; i < process.argv.length; i++) {//loop through all positions to collect title, if title > one word
		songArray.push(process.argv[i]);
		song = songArray.join(" ");//clean up songArray if song title contains multiple words
	}

	var spotify = new Spotify({
	  id: spotConsumerKey,
	  secret: spotConsumerSecret,
	});

	if (song == ""){//If no song is provided then query "The Sign" by Ace of Base.

		spotify
		  .search({ type: 'track', query: "Ace of Base", limit: 3 })
		  .then(function(response, error) {

		  var path = response.tracks.items[2];//capture path for easy re-use

		console.log("###############################################\r\n");//log seperator for readability

			console.log(//log pertinent details from OMDB JSON
		  	  "Artist(s): " + path.artists[0].name + "\r\n" +
			  "Song Name: " + path.name + "\r\n" +
			  "Preview Link: " + path.href + "\r\n" +
			  "Album: " + path.album.name + "\r\n"

			);

		console.log("###############################################");//log seperator for readability

		});
	}

	else {
		spotify
		  .search({ type: 'track', query: song, limit: 1 })
		  .then(function(response, error) {

		  var path = response.tracks.items[0];//capture path for easy re-use

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
}

//---------------------------------------------------------------

//TWITTER:

else if (position2 == twitterCommand){//when the twitter command is executed ...

	var client = new Twitter({
  		consumer_key: twitterConsumerKey,
	    consumer_secret: twitterConsumerSecret,
	    access_token_key: twitterAccessTokenKey,
	    access_token_secret: twitterAccessTokenSecret
	});

	client.get('statuses/user_timeline', function(error, tweets) {

		if(error) throw error;

		console.log("###############################################\r\n");//log seperator for readability

	    for (i = 0; i < tweets.length ; i++) {//loop through each position of the tweet array

	    	var tweetNum = i + 1; //store correct tweet number for display purposes

	    	if (i === 0) {//if tweet #1 is posted, clarify that this is the most recent tweet

	    		console.log("Tweet #1 (Most Recent): " + tweets[i].text + "\r\n");
	    	}

	    	else {//otherwise list normally

	    		console.log("Tweet #" + tweetNum + ": " + tweets[i].text + "\r\n");
	    	};
	    }

		 console.log("###############################################\r\n");//log seperator for readability

	});

}

//---------------------------------------------------------------

//DO:

else if (position2 == doCommand){//when the do command is executed ...

	fs.readFile('random.txt', 'utf8', function (err, data) {

	   if (err) {
	      return console.error(err);
	   };

	   console.log(data);

	});

}

//---------------------------------------------------------------

//if nothing is entered:

else if (position2 === undefined){//when the do command is executed ...

	   console.log("###############################################\r\n");//log seperator for readability

	   console.log("... but you didn't enter a command. Please choose from the following commands:\r\n" + 
	   	"Enter '" + movieCommand + "' following a movie title.\r\n" +
	   	"Enter '" + songCommand + "' following a song name.\r\n" +
	   	"Enter '" + twitterCommand + "' to see my 20 most recent tweets.\r\n" +
	   	"Enter '" + doCommand + "' to see some custom commands play out.\r\n"
	   	);

	   console.log("###############################################\r\n");//log seperator for readability

}

//---------------------------------------------------------------

else {//when something that isn't the list of command is entered ...

	   console.log("###############################################\r\n");//log seperator for readability

	   console.log("You entered an incorrect command. Please choose from the following commands:\r\n" + 
	   	"Enter '" + movieCommand + "' following a movie title.\r\n" +
	   	"Enter '" + songCommand + "' following a song name.\r\n" +
	   	"Enter '" + twitterCommand + "' to see my 20 most recent tweets.\r\n" +
	   	"Enter '" + doCommand + "' to see some custom commands play out.\r\n"
	   	);

	   console.log("###############################################\r\n");//log seperator for readability

};