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

import { openDb, closeDb } from "./models/db";
import { comparePassword } from "./models/encryption";

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
    // store: openDb()
  })
);
app.use(passport.initialize());
app.use(passport.session());

// define a passport strategy
passport.use(new LocalStrategy(async (username, password, done) => {
  try {
    const user = await getUserByUsername(username);
    if (!user) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    // call c function to compare the password with the hashed password
    const isPasswordMatched = comparePassword(password, user.password);
    if (!isPasswordMatched) {
      return done(null, false, { message: 'Incorrect username or password.' });
    }
    // if authentication succeeds, return the user
    return done(null, user);
  } catch (err) {
    return done(err);
  }
}));

// serialize and deserialize user
passport.serializeUser((user: any, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id: any, done) => {
  try {
    const user = await getUserById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// routes
app.use("/", indexRouter); // base page - login/ register
app.use("/", profileRouter);
app.use("/", appRouter);

app.listen(port, () => {
  console.log(`⚡️[weasel-server.ts]: running @ http://localhost:${port}`);
});

export default app;

// compile with tsc in root
