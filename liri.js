require("dotenv").config();

var request = require("request");
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var input = process.argv;
var liriCommand = input[2];
var movieName = "";
var songName = "";
var addedToLogFile = "Results added to random.txt file."

if (liriCommand === "movie-this") {
	getMovieInfo();
}


else if (liriCommand === "spotify-this-song") {
	getSongInfo(songName);
}


else if (liriCommand === "do-what-it-says") {
    
	logData("liri command: do-what-it-says");
	doWhatItSays();
}


else if (liriCommand === "help") {
	showHelp();
}


else {
	console.log("Command not found. Run 'node liri.js help' to see a list of available commands.");
}

function getMovieInfo() {

	for (var i = 3; i < input.length; i++) {

	  if (i > 2 && i < input.length) {
	    movieName = movieName + " " + input[i];
	  }
	}

	 if (!movieName) {
	 	movieName = "Mr Nobody";
	 	console.log("If you haven't watched Mr. Nobody, then you should: http://www.imdb.com/title/tt0485947/");
	 	console.log("It's on Netflix!")
	}

	figlet(movieName, function(err, data) {
	    if (err) {
	        console.log('Something went wrong...');
	        console.dir(err);
	        return;
	    }
	    console.log(data)
	});

	request("http://www.omdbapi.com/?t=" + movieName + "&apikey=trilogy", function(error, response, body) {

		if (!error && response.statusCode === 200) {
			var movieInfo = JSON.parse(body);
			var tomatoRating = movieInfo.Ratings[1].Value;
			var movieResult = 
				"=======================================================" + "\r\n" +
				"liri command: movie-this " + movieName + "\r\n" +
				"=======================================================" + "\r\n" +
				"Title: " + movieInfo.Title + "\r\n" +
				"Year movie was released: " + movieInfo.Year + "\r\n" +
				"IMDB movie rating (out of 10): " + movieInfo.imdbRating + "\r\n" +
				"Rotten Tomatoes rating (out of 100%): " + tomatoRating + "\r\n" +
				"Filmed in: " + movieInfo.Country + "\r\n" +
				"Language: " + movieInfo.Language + "\r\n" + 
				"Movie plot: " + movieInfo.Plot + "\r\n" +
				"Actors: " + movieInfo.Actors + "\r\n" +
				"========================================================"

			console.log(movieResult);
			logData(movieResult);
		}
	});
 }

function getSongInfo(songName) {
	for (var i=3; i < input.length; i++){
		songName = songName + " " + input[i];
	}

	logData("==========================================================================");
	logData("liri command: spotify-this-song");

	var spotify = new Spotify({
  		id: process.env.SPOTIFY_ID,
  		secret: process.env.SPOTIFY_SECRET
	});

	if (!songName) {
		songName = "The Sign";
	}

	figlet(songName, function(err, data) {
	    if (err) {
	        console.log('Something went wrong...');
	        console.dir(err);
	        return;
	    }
	    console.log(data);
	});

	spotify.search({ type: 'track', query: songName, limit: 10 }, function(err, data) {

  
  		if (err) {
    		return console.log('Error occurred: ' + err);
  		}
 

	if (songName === "The Sign") {
		var defaultSong = 
		"Artist: " + data.tracks.items[5].artists[0].name + "\r\n" + 
		"Song title: " + data.tracks.items[5].name + "\r\n" +
		"Preview song: " + data.tracks.items[5].preview_url + "\r\n" +
		"Album: " + data.tracks.items[5].album.name + "\r\n" 

		console.log (defaultSong);
		console.log(addedToLogFile);
		logData(defaultSong);
		logData("==========================================================================");
	}

	else {
		console.log("Top 10 songs on Spotify with the name, " + songName);
		logData("Top 10 songs on Spotify with the name, " + songName);
		for (var i = 0; i < data.tracks.items.length; i++) {
			var trackInfo = data.tracks.items[i];

			var previewSong = trackInfo.preview_url;
			if (previewSong === null) {
				previewSong = "Song preview is not available for this song.";
            }
            
			var songResults = 
				"==========================================================================" + "\r\n" +
				"Song #" + (i+1) + "\r\n" +
				"Artist: " + trackInfo.artists[0].name + "\r\n" +
				"Song title: " + trackInfo.name + "\r\n" +
				"Preview song: " + previewSong + "\r\n" +
				"Album: " + trackInfo.album.name + "\r\n" +
				"==========================================================================";

			console.log(songResults);
			logData(songResults);
		}
	}
	});
}

function doWhatItSays() {
	fs.readFile("random.txt", "utf8", function(error, data) {
  		if (error) {
    		return console.log(error);
  		}
  		var songdataArray = data.split(",");

  		getSongInfo(songdataArray[1]);
 	});
}
