const { actors } = require("../dataForQuestions");
const axios = require("axios");

class DataAccess {
  constructor() {
    this.apiKey = "ac505a02032a33d65dd28b41f72182e1";
  }

  getCreditData = async (movieID) => {
    try {
      return await axios.get(
        `https://api.themoviedb.org/3/movie/${movieID}/credits?api_key=${this.apiKey}`
      );
    } catch (e) {
      console.log(e);
      throw e;
    }
  };

  getMoviePerActor = (credits, movieName) => {
    const moviePerActor = {};
    credits.data.cast.map((cast) => {
      if (cast.known_for_department == "Acting") {
        actors.map((actor) => {
          if (cast.original_name === actor) {
            if (!moviePerActor[actor]) {
              moviePerActor[actor] = [movieName];
            } else {
              moviePerActor[actor].push(movieName);
            }
          }
        });
      }
    });
    return moviePerActor;
  };

  getCharacterName = (credits, movieName) => {
    const moviePerActor = {};
    credits.data.cast.map((cast) => {
      if (cast.known_for_department == "Acting") {
        actors.map((actor) => {
          if (cast.original_name === actor) {
            const characterName = cast.character;
            if (!moviePerActor[actor]) {
              moviePerActor[actor] = [
                {
                  movieName,
                  characterName,
                },
              ];
            } else {
              moviePerActor[actor].push({ movieName, characterName });
            }
          }
        });
      }
    });
    return moviePerActor;
  };

  getMoviePerCharacter = (credits, movieName) => {
    const moviePerCharacter = {};
    credits.data.cast.map((cast) => {
      if (cast.known_for_department == "Acting") {
        actors.map((actor) => {
          if (cast.original_name === actor) {
            const characterName = cast.character;
            if (!moviePerCharacter[movieName]) {
              moviePerCharacter[movieName] = {
                [characterName]: [actor],
              };
            } else if (!moviePerCharacter[movieName][characterName]) {
              moviePerCharacter[movieName] = {
                [characterName]: [actor],
              };
            } else {
              moviePerCharacter[movieName][characterName].push(actor);
            }
          }
        });
      }
    });
    return moviePerCharacter;
  };

  filterCharacters = (dict) => {
    const result = {};
    for (let key in dict) {
      const foundCharacters = [];
      result[key] = dict[key].filter((moviePerActor) => {
        if (!foundCharacters.includes(moviePerActor.characterName)) {
          foundCharacters.push(moviePerActor.characterName);
          return true;
        } else {
          return false;
        }
      });
      console.log(result);
    }
    return result;
  };
}

module.exports = DataAccess;
