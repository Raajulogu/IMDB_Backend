import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./db.js";
import { userRouter } from "./Routes/user.js";
import { movieRouter } from "./Routes/movie.js";
import { actorRouter } from "./Routes/actor.js";
import { producerRouter } from "./Routes/producer.js";

//ENV Configuration
dotenv.config();

let app = express();
let PORT = process.env.PORT;

//Midlewares

app.use(express.json());
app.use(cors());

//db Connection
dbConnection();

//routes
app.use("/api/user", userRouter);
app.use("/api/movie", movieRouter);
app.use("/api/actor", actorRouter);
app.use("/api/producer", producerRouter);

//server connection
app.listen(PORT, () => console.log(`Server listening on ${PORT}`));
