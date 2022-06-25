import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

import postRouter from "./routes/postsRoutes.js";
import userRouter from "./routes/userRoutes.js";

const app = express();

app.use(bodyParser.json({ limit: "30mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "30mb", extended: true }));
app.use(cors());

app.use("/posts", postRouter);
app.use("/user", userRouter);

const PORT = process.env.PORT;

const DATABASE = process.env.DATABASE_LOCAL;

mongoose
  .connect(DATABASE)
  .then(() => app.listen(PORT, () => console.log("Server running")))
  .catch((error) => console.error(error));
