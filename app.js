import createError from "http-errors";
import express from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import { indexRouter } from "./routes/index.js";
import { usersRouter } from "./routes/users.js";
import { landRouter } from "./routes/land.js";
import { characterRouter } from "./routes/character.js";
import { timesRouter } from "./routes/time.js";
import { pricesRouter } from "./routes/price.js"
import connect from "./lib/db.js";


const app = express();

app.set("db", async (collection) => {
  const mongo = await connect();
  return mongo.db("lord_of_rings").collection(collection);
});
app.set("binance", async (collection) => {
  const mongo = await connect();
  return mongo.db("binance").collection(collection);
});
console.log('here')
app.use(cors())
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(path.resolve(), "public")));

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/lands",landRouter);
app.use("/characters",characterRouter)
app.use("/times", timesRouter)
app.use("/prices", pricesRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.json({ message: "error" });
});
console.log('here1')
app.listen(8000, () => {
  console.log(`listening on port ${8000}`);
})