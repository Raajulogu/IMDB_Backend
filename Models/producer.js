import mongoose from "mongoose";

let producerSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
    unique: true,
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

let Producer = mongoose.model("Producer", producerSchema);
export { Producer };
