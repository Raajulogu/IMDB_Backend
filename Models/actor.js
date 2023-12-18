import mongoose from "mongoose";

let actorSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  gender: {
    type: "string",
    required: true,
  },
  dob: {
    type: "String",
    required: true,
  },
  age: {
    type: "String",
    required: true,
  },
  movies: {
    type: "Array",
    default: [],
  },
  bio: {
    type: "String",
    required: true,
  },
  img: {
    type: "String",
    required: true,
  },
});

let Actor = mongoose.model("Actor", actorSchema);
export { Actor };
