import mongoose from "mongoose";

export function dbConnection() {
  try {
    mongoose.connect(
      "mongodb+srv://rajesh:rajesh145@cluster0.563jw0h.mongodb.net/IMDB_Clone?retryWrites=true&w=majority"
    );
    console.log("Databse Connected Successfully");
  } catch (error) {
    console.log("Error in connecting DB", error);
  }
}
