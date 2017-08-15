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

//re-used strings:
var seperator = "###############################################\r\n\r\n";
var guideMessage = "Enter '" + movieCommand + "' following a movie title.\r\n" +
		   	   	   "Enter '" + songCommand + "' following a song name.\r\n" +
		   		   "Enter '" + twitterCommand + "' to see my 20 most recent tweets.\r\n" +
		   		   "Enter '" + doCommand + "' to see some custom commands play out.\r\n";

//fuction for console-logging data in addition to appending to log.txt file:
function log (dataToLog) {

	console.log(dataToLog);

	fs.appendFile('log.txt', dataToLog, 'utf8', function(err){//log pertinent movie info to log.txt
	 		return console.log(err);
	});
};

//fuction for querying song with spoitfy module:

function spotifySearch (songName, objectIndex, queryLimit) {

	var spotify = new Spotify({
	  id: spotConsumerKey,
	  secret: spotConsumerSecret,
	});

	spotify
	  .search({ type: 'track', query: songName, limit: queryLimit })
	  .then(function(response, error) {

	  var path = response.tracks.items[objectIndex];//capture path for easy re-use

	  var songString = seperator + 
				   	   "Artist(s): " + path.artists[0].name + "\r\n" +
				       "Song Name: " + path.name + "\r\n" +
				       "Preview Link: " + path.href + "\r\n" +
				       "Album: " + path.album.name + "\r\n\r\n" +
				       seperator;

		log(songString);//log pertinent song info to console and log.txt
	});
};

//---------------------------------------------------------------

//OMDB:

if (position2 == movieCommand){//when the movie command is executed ...

	var titleArray = [];
	var movieTitle = "";
	var queryURL = "";//API query URL

	for (var i = 3; i < process.argv.length; i++) {//loop through all positions to collect title, if title > one word
		titleArray.push(process.argv[i]);
		movieTitle = titleArray.join(" ");
	}

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

		var movieString = seperator + 
				  	  	  "Movie Title: " + cleanResponse.Title + "\r\n" +
					  	  "Year: " + cleanResponse.Year + "\r\n" +
					  	  "IMDB Rating: " + cleanResponse.Ratings[0].Value + "\r\n" + 
					  	  "Rotton Tomoatoes Rating: " + rottonTomoatoesRating + "\r\n" +
					  	  "Country: " + cleanResponse.Country + "\r\n" +
					  	  "Language: " + cleanResponse.Language + "\r\n" +
					  	  "Plot: " + cleanResponse.Plot + "\r\n" +
					  	  "Actors/Actresses: " + cleanResponse.Actors + "\r\n\r\n" +
					  	  seperator;

		log(movieString);//log pertinent movie info to console and log.txt

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

	if (song == ""){//If no song is provided then query "The Sign" by Ace of Base.

		spotifySearch('Ace of Base', 2, 3);
	}

	else {

		spotifySearch(song, 0, 1);

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

		if (error) throw error;

		log(seperator);//log seperator for readability

	    for (i = 0; i < tweets.length ; i++) {//loop through each position of the tweet array

	    	var tweetNum = i + 1; //store correct tweet number for display purposes

	    	if (i === 0) {//if tweet #1 is posted, clarify that this is the most recent tweet

	    		log("Tweet #1 (Most Recent): " + tweets[i].text + "\r\n");
	    	}

	    	else {//otherwise list normally

	    		log("Tweet #" + tweetNum + ": " + tweets[i].text + "\r\n");
	    	};
	    }

		 log(seperator);//log seperator for readability

	});

}

//---------------------------------------------------------------

//DO:

else if (position2 == doCommand){//when the do command is executed ...

	fs.readFile('random.txt', 'utf8', function (err, data) {

	   if (err) {
	      return console.error(err);
	   };

	   var dataArray = data.split(',');//convert string in .txt file to array

	    for (i = 0; i < dataArray.length; i++) {//loop through dataArray

	   		var keyword = dataArray[i + 1];//capture query keyword which should always follow command in the array

	   		if (dataArray[i] == songCommand){//if the song command is found, initiate spotify module

	   			spotifySearch(keyword, 0, 1);

	  		 };
		};
	});
}

//---------------------------------------------------------------

//if nothing is entered:

else if (position2 === undefined){//when the do command is executed ...

	   console.log(seperator);//log seperator for readability

	   console.log("... but you didn't enter a command. Please choose from the following commands:\r\n" + guideMessage);

	   console.log(seperator);//log seperator for readability

}

//---------------------------------------------------------------

else {//when something that isn't in the list of commands is entered ...

	   console.log(seperator);//log seperator for readability

	   console.log("You entered an incorrect command. Please choose from the following commands:\r\n" + guideMessage);

	   console.log(seperator);//log seperator for readability

};

//---------------------------------------------------------------END