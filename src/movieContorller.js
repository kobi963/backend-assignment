var express = require("express");
const { movies } = require("../dataForQuestions");
const DataAccess = require("./dataAccess");

const dataAccess = new DataAccess();
var router = express.Router();

router.get("/moviesPerActor", async (req, res) => {
  const dict = {};
  for (let movieName in movies) {
    const credits = await dataAccess.getCreditData(movies[movieName]);
    const result = dataAccess.getMoviePerActor(credits, movieName);
    for (let res in result) {
      if (dict[res]) {
        dict[res] = dict[res].concat(result[res]);
      } else {
        dict[res] = result[res];
      }
    }
  }
  res.send(dict);
});

router.get("/actorsWithMultipleCharacters", async (req, res) => {
  const dict = {};
  for (let movieName in movies) {
    const credits = await dataAccess.getCreditData(movies[movieName]);
    const characterNames = dataAccess.getCharacterName(credits, movieName);
    for (let actor in characterNames) {
      if (dict[actor]) {
        dict[actor] = dict[actor].concat(characterNames[actor]);
      } else {
        dict[actor] = characterNames[actor];
      }
    }
  }
  const result = dataAccess.filterCharacters(dict);
  const atLeastTwoCharacters = {};
  for (let actor in result) {
    if (result[actor].length > 1) {
      atLeastTwoCharacters[actor] = result[actor];
    }
  }
  res.send(atLeastTwoCharacters);
});

router.get("/charactersWithMultipleActors", async (req, res) => {
  const dict = {};

  for (let movieName in movies) {
    const credits = await dataAccess.getCreditData(movies[movieName]);
    const moviePerCharacter = dataAccess.getMoviePerCharacter(
      credits,
      movieName
    );
    for (let movie in moviePerCharacter) {
      if (dict[movie]) {
        dict[movie] = dict[movie].concat(moviePerCharacter[movie]);
      } else {
        dict[movie] = moviePerCharacter[movie];
      }
    }
  }
  res.send(dict);
});

module.exports = router;
