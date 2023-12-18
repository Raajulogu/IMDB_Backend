import mongoose from "mongoose";

let movieSchema = new mongoose.Schema({
  name: {
    type: "string",
    required: true,
  },
  year: {
    type: "string",
    required: true,
  },
  plot: {
    type: "String",
    required: true,
  },
  poster: {
    type: "String",
    required: true,
  },
  actors: {
    type: "Array",
    default: [],
  },
  producer: {
    type: "String",
    required: true,
  },
});

let Movie = mongoose.model("Movie", movieSchema);
export { Movie };
