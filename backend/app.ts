import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";

import userRouter from "./routes/user";
import mainAppRouter from "./routes/mainApp";
import indexRouter from "./routes/index";

// import SQLite_c_call from 'db/ whatever';

dotenv.config();

const app = express();
const port: string = process.env.PORT;

// view engine
app.set("view engine", "pug");
// set path to views directory
app.set("views", path.join(__dirname, "public", "pug"));

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
    // store: new SQLite_c_call({ db: 'whatever.db', dir: './var/db' })
  })
);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());
// routes
app.use("/", indexRouter); // base page - login/ register
app.use("/", userRouter);
app.use("/", mainAppRouter);

app.listen(port, () => {
  console.log(`⚡️[weasel-server.ts]: running @ http://localhost:${port}`);
});

export default app;
