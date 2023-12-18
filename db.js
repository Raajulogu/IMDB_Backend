import mongoose from "mongoose";

export function dbConnection() {
  try {
    mongoose.connect(
      `${process.env.momgo_url}`
    );
    console.log("Databse Connected Successfully");
  } catch (error) {
    console.log("Error in connecting DB", error);
  }
}
