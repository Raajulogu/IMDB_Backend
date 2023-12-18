import express from "express";
import { User, decodeJwtToken } from "../Models/user.js";
import { Actor } from "../Models/actor.js";
import { Movie } from "../Models/movie.js";

let router = express.Router();

//Add New Actor
router.post("/add-actor", async (req, res) => {
  try {
    //Check user is logged in
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    // Check Actor is Already available
    let movie = await Actor.findOne({ name: req.body.name });
    if (movie)
      return res.status(400).json({ message: "Actor Already Available" });

    //Adding new Actor to DB
    let newActor = await new Actor({
      name: req.body.name,
      gender: req.body.gender,
      dob: req.body.dob,
      age: req.body.age,
      bio: req.body.bio,
      img: req.body.img,
    }).save();

    res.status(200).json({ message: "Actor Added successfully" });
  } catch (error) {
    console.log("Error in Adding Actor", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get Actor by Id
router.get("/get-actor-data-by-id", async (req, res) => {
  try {
    //Check user is logged in
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    let id = req.headers["id"];
    //Get actor by id
    let actor = await Actor.findById({ _id: id });

    //Get Actor's all Movies
    let movies = await Movie.find();
    let movie_Data = movies.filter((val) => {
      if (actor.movies.includes(val._id)) {
        return val;
      } else {
        return false;
      }
    });
    let actor_Data = {
      actor,
      movies: movie_Data,
    };

    res
      .status(200)
      .json({ message: "Actor Data Got Successfully", actor_Data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get All Actors Data
router.get("/get-all-actors", async (req, res) => {
  try {
    //Check user is logged in
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    //Get all Actors
    let actors = await Actor.find();
    res.status(200).json({ message: "Actors Data Got Successfully", actors });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export let actorRouter = router;
