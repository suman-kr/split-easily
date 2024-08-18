import express, { json } from "express";
import logger from "morgan";
import bodyParser from "body-parser";
import { Routes } from "./routes";
import { databaseInit } from "./db";

const port = 3000;

export class Express {
  static init() {
    const app = express();
    app.use(logger("common"));
    app.use(json());
    app.use(bodyParser.urlencoded({ extended: false }));

    // parse application/json
    app.use(bodyParser.json());

    app.get("/ping", (req, res) => {
      res.send({ message: "ping test" });
    });

    // Routes
    app.use("/api/v1", Routes);

    app.listen(port, () => {
      console.log(`Server started at http://localhost:${port}`);
      databaseInit();
    });
  }
}