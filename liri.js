var fs = require("fs");
var axios = require("axios");
var inquirer = require("inquirer");
require("dotenv").config();
var keys = require("./keys.js");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var moment = require("moment");
moment().format();
const hr =
  "-----------------------------------------------------------------------------";
const dblRow =
  "=============================================================================";
const spacer = "";

function liriSwitch() {
  switch (process.argv[2]) {
    case `concert-this`:
      concertCall();
      break;
    case `spotify-this-song`:
      spotifyThisSong();
      break;
    case `movie-this`:
      movieCall();
      break;
    case `do-what-it-says`:
      doWhatItSays();
      break;
  }
}

function concertCall() {
  var nodeArgs = process.argv;
  nodeArgs.shift();
  nodeArgs.shift();
  nodeArgs.shift();
  var artist = "";
  nodeArgs.map(name => {
    artist += name + "+";
  });
  artist.substring(0, artist.length - 1);
  artist = "";
  let queryUrl =
    "https://rest.bandsintown.com/artists/" +
    artist +
    "/events?app_id=codingbootcamp";
  axios.get(queryUrl).then(function(response) {
    console.log("The movie's genre is: " + response.data);
  });
}

function doWhatItSays() {
  var nodeArgs = process.argv;
  fs.readFile("random.txt", "utf8", (error, data) => {
    if (error) {
      return console.log(error);
    }
    let dataArr = data.split(", ");
    nodeArgs[2] = dataArr[0];
    nodeArgs[3] = dataArr[1];
    liriSwitch();
  });
}

function movieCall() {
  var nodeArgs = process.argv;
  nodeArgs.shift();
  nodeArgs.shift();
  nodeArgs.shift();
  var movieName = "";
  nodeArgs.map(name => {
    movieName += name + "+";
  });
  movieName.substring(0, movieName.length - 1);

  console.log(movieName);
  var queryUrl =
    "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=trilogy";
  axios.get(queryUrl).then(function(response) {
    console.log("The movie's genre is: " + response.data.Genre);
    console.log("The movie's title is: " + response.data.Title);
    console.log("The movie's year is: " + response.data.Year);
    console.log("The movie's rating is: " + response.data.Rating);
    console.log("The movie's Plot is: " + response.data.Plot);
    console.log("The movie's Language is: " + response.data.Language);
    console.log("The movie's Actors is: " + response.data.Actors);
    console.log("The movie's Country is: " + response.data.Country);
  });
}

const logToConsole = array => {
  for (let line of array) {
    console.log(line);
  }
};

function spotifyThisSong() {
  console.log("jsfdg");
  let songName;
  process.argv.length < 4
    ? (songName = "The Sign Ace of Base")
    : (songName = process.argv[3]);
  let spotify = new Spotify(keys.spotify);
  spotify.search(
    { type: "track", query: songName, limit: 1 },
    (error, data) => {
      if (error) {
        return console.log("Error occurred: " + error);
      } else {
        let artistNamesArray = [];
        data.tracks.items[0].artists.forEach(artist => {
          artistNamesArray.push(artist.name);
        });
        displayArray = [
          dblRow,
          moment().format("MMMM Do YYYY, h:mm:ss a"),
          `spotify-this called: ${songName}`,
          spacer,
          `Here is the information I was able to find on Spotify regarding "${songName}":`,
          hr,
          ` * Artist(s): ${artistNamesArray.join(", ")}`,
          ` * Song Title: ${data.tracks.items[0].name}`,
          ` * Preview Link: ${data.tracks.items[0].external_urls.spotify}`,
          ` * Album:' ${data.tracks.items[0].album.name}`,
          dblRow,
          spacer
        ];
        let link = data.tracks.items[0].external_urls.spotify;
        logToConsole(displayArray);
        displayArray = [];
        playTheSong(link);
      }
    }
  );
}
liriSwitch();
