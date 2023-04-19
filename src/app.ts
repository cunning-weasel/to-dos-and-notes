import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import LocalStrategy from 'passport-local';
import session from "express-session";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";

import profileRouter from "./routes/profile";
import appRouter from "./routes/app";
import indexRouter from "./routes/index";

// import db from './models/app';
// const { encryptPassword, comparePassword } = require('./my-c-encryption-functions');

dotenv.config();
const app = express();
const port: string = process.env.PORT;

// view engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// middleware
app.use(helmet());
app.use(logger("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(express.urlencoded({ extended: false }));
// middleware for serving static files (CSS, images, etc.)
app.use(
  "/public",
  express.static(path.join(__dirname, "public"), {
    setHeaders: (res, path) => {
      if (path.endsWith(".css")) {
        res.setHeader("Content-Type", "text/css");
      }
    },
  })
);
// passport middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
    // store: new SQLite_c_call({ db: 'whatever.db', dir: '/models/db' })
  })
);
app.use(passport.initialize());
app.use(passport.session());

// routes
app.use("/", indexRouter); // base page - login/ register
app.use("/", profileRouter);
app.use("/", appRouter);

app.listen(port, () => {
  console.log(`⚡️[weasel-server.ts]: running @ http://localhost:${port}`);
});

export default app;

// compile with tsc in root
