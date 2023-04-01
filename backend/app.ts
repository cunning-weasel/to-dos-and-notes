import express, { NextFunction } from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
// import myDB from "i.e connection";
// i.e import { ObjectID } from "sqlite";

import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import indexRouter from "./routes/index";
import usersRouter from "./routes/users";

const app = express();
dotenv.config();
const port: string = process.env.PORT;

// template
app.set("view engine", "pug");
// render pug
app.route("/").get((req, res) => {
  res.render("public/pug/index.pug", {
    title: "hiiiiiiiiiiiiiiieeee",
    message: "Pwease log in",
  });
});

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// passport
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use("/", indexRouter);
app.use("/users", usersRouter);

// time-logging - could handle dates this way?
// const getTheCurrentTimeString = () => {
//   return new Date().toString();
// }

app.listen(port, () => {
  console.log(`⚡️[weasel-server.ts]: running @ http://localhost:${port}`);
});

export default app;
