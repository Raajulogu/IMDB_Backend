import express from "express";
import { User, decodeJwtToken } from "../Models/user.js";
import { Producer } from "../Models/producer.js";
import { Movie } from "../Models/movie.js";

let router = express.Router();

//Add New Producer
router.post("/add-producer", async (req, res) => {
  try {
    //Check user is logged in
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    // Check Producer is Already available
    let movie = await Producer.findOne({ name: req.body.name });
    if (movie)
      return res.status(400).json({ message: "Producer Already Available" });

    //Adding new Producer to DB
    let newProducer = await new Producer({
      name: req.body.name,
      gender: req.body.gender,
      dob: req.body.dob,
      age: req.body.age,
      bio: req.body.bio,
      img: req.body.img,
    }).save();

    res.status(200).json({ message: "Producer Added successfully" });
  } catch (error) {
    console.log("Error in Adding Producer", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get Producer by Id
router.get("/get-producer-data-by-id", async (req, res) => {
  try {
    //Check user is logged in
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    let id = req.headers["id"];
    //Get producer by id
    let producer = await Producer.findById({ _id: id });

    //Get Producer's all Movies
    let movies = await Movie.find();
    let movie_Data = movies.filter((val) => {
      if (producer.movies.includes(val._id)) {
        return val;
      } else {
        return false;
      }
    });
    let producer_Data = {
      producer,
      movies: movie_Data,
    };
    res
      .status(200)
      .json({ message: "Producer Data Got Successfully", producer_Data });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//Get All Producer Data
router.get("/get-all-producer", async (req, res) => {
  try {
    //Check user is logged in
    let token = req.headers["x-auth"];
    let userId = decodeJwtToken(token);
    let user = await User.findById({ _id: userId });
    if (!user)
      return res.status(400).json({ message: "Invalid Authorization" });

    //Get all Actors
    let producer = await Producer.find();
    res
      .status(200)
      .json({ message: "Producer Data Got Successfully", producer });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export let producerRouter = router;
