import express from "express";
import { Movie } from "../Models/movie.js";
import { User, decodeJwtToken } from "../Models/user.js";
import { Actor } from "../Models/actor.js";
import { Producer } from "../Models/producer.js";

let router = express.Router();

//Add New Movie
router.post("/add-movie", async (req, res) => {
  try {
    //Check user is logged in
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    // Check Movie already is available
    let movie = await Movie.findOne({ name: req.body.name });
    if (movie)
      return res.status(400).json({ message: "Movie Already Available" });

    //Check All Actors is available in db
    let actors = req.body.actors;
    for (var i = 0; i < actors.length; i++) {
      let actor = await Actor.findOne({ name: actors[i] });
      if (!actor)
        return res.status(200).json({ message: "Actor Not Available" });
    }
    let producer = await Producer.findOne({ name: req.body.producer });
    if (!producer)
      return res.status(200).json({ message: "Producer Not Available" });
    //Adding new Movie to DB
    let newMovie = await new Movie({
      name: req.body.name,
      year: req.body.year,
      plot: req.body.plot,
      poster: req.body.poster,
      actors: req.body.actors,
      producer: req.body.producer,
    }).save();

    //Function for add movies to actors movie list
    for (var i = 0; i < actors.length; i++) {
      let actor = await Actor.findOne({ name: actors[i] });
      if (!actor)
        return res.status(200).json({ message: "Actor Not Available" });
      let movies = [...actor.movies, newMovie._id];
      await Actor.findOneAndUpdate(
        { name: actors[i] },
        { $set: { movies: movies } }
      );
    }
    //Add movie in producer movie list
    let movies = [...producer.movies, newMovie._id];
    await Producer.findOneAndUpdate(
      { name: req.body.producer },
      { $set: { movies: movies } }
    );

    res.status(200).json({ message: "Movie Added successfully" });
  } catch (error) {
    console.log("Error in Adding Movie", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Edit Movie
router.put("/edit-movie", async (req, res) => {
  try {
    //Check user is logged in
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    let movieId = req.body.id;
    // Check Movie is available
    let movie = await Movie.findOne({ _id: movieId });
    if (!movie) return res.status(400).json({ message: "Invalid Movie Id" });
    //Check Produceris available in DB
    let producers = await Producer.findOne({ name: req.body.producer });
    if (!producers)
      return res.status(200).json({ message: "Producer Not Available" });

    //Check Actors Available in DB
    let actors = req.body.actors;
    for (var i = 0; i < actors.length; i++) {
      let actor = await Actor.findOne({ name: actors[i] });
      if (!actor) {
        return res.status(200).json({ message: "Actor Not Available" });
      }
    }

    //Function for add movies to actors movie list
    for (var i = 0; i < actors.length; i++) {
      let actor = await Actor.findOne({ name: actors[i] });
      let movies = [...actor.movies, movieId];
      await Actor.findOneAndUpdate(
        { name: actors[i] },
        { $set: { movies: movies } }
      );
    }

    //Function for remove movies from actors movie list
    async function removeMovie({ name, movie }) {
      let actor = await Actor.findOne({ name });
      let removed_movies = actor.movies.filter((val) => {
        if (val !== movie) {
          return val;
        } else {
          return false;
        }
      });
      await Actor.findOneAndUpdate(
        { name },
        { $set: { movies: removed_movies } }
      );
    }
    let removeactors = movie.actors;
    for (var i = 0; i < removeactors.length; i++) {
      removeMovie({ movie: movieId, name: removeactors[i] });
    }
    //Remove movie in producer movie list
    let removeproducer = await Producer.findOne({ name: req.body.producer });
    let removed_movies = removeproducer.movies.filter((val) => {
      if (val !== movieId) {
        return val;
      } else {
        return false;
      }
    });
    await Producer.findOneAndUpdate(
      { name: req.body.producer },
      { $set: { movies: removed_movies } }
    );
    //Editing Movie
    let editMovie = await Movie.findOneAndUpdate(
      { _id: movieId },
      {
        $set: {
          name: req.body.name,
          year: req.body.year,
          plot: req.body.plot,
          poster: req.body.poster,
          actors: req.body.actors,
          producer: req.body.producer,
        },
      }
    );

    //Add movie in producer movie list
    let producer = await Producer.findOne({ name: req.body.producer });
    let movies = [...producer.movies, movieId];
    await Producer.findOneAndUpdate(
      { name: req.body.producer },
      { $set: { movies: movies } }
    );

    res.status(200).json({ message: "Movie Edited successfully" });
  } catch (error) {
    console.log("Error in Editing Movie", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get Movie by Id
router.get("/get-movie-data-by-id", async (req, res) => {
  try {
    //Check user is logged in
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    let id = req.headers["id"];
    //Get producer by id
    let movie = await Movie.findById({ _id: id });

    //Get Actor's all Movies
    let actors = await Actor.find();
    let actor_Data = actors.filter((val) => {
      if (movie.actors.includes(val.name)) {
        return val;
      } else {
        return false;
      }
    });
    let movie_Data = {
      movie,
      actors: actor_Data,
    };
    res
      .status(200)
      .json({ message: "Movie Data Got Successfully", movie_Data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get All Movies Data
router.get("/get-all-movies", async (req, res) => {
  try {
    //Check user is logged in
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    //Get all Movies
    let movies = await Movie.find();
    res.status(200).json({ message: "movies Data Got Successfully", movies });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Delete Movie
router.delete("/delete-movie", async (req, res) => {
  try {
    //Check user is logged in
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    let movieId = req.headers["id"];
    // Check Movie is available
    let movie = await Movie.findOne({ _id: movieId });
    if (!movie) return res.status(400).json({ message: "Invalid Movie Id" });

    let deleteMovie = await Movie.findByIdAndDelete({ _id: movieId });

    res.status(200).json({ message: "Movie Deleted Successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export let movieRouter = router;
