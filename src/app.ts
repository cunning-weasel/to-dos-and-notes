import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import session from "express-session";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import cors from "cors";
import helmet from "helmet";

import profileRouter from "./routes/profile";
import appRouter from "./routes/app";
import indexRouter from "./routes/index";

import { openDb, getUserName, customSqLiteStore, closeDb } from "./models/db";
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
    resave: false, // don't save session if unmodified
    saveUninitialized: false, // don't create session until something stored
    store: new customSqLiteStore(),
  })
);
app.use(passport.initialize());
app.use(passport.authenticate("session"));
// define passport strategy
passport.use(
  new LocalStrategy(async (username, password, done) => {
    if (openDb()) {
      try {
        const user = getUserName(username);
        if (!user) {
          return done(null, false, {
            message: "Incorrect username.",
          });
        }

        const isPasswordMatched = comparePassword(password, username);
        if (!isPasswordMatched) {
          return done(null, false, {
            message: "Incorrect password.",
          });
        }
        // if authentication success, return user
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    }
    closeDb();
  })
);
// serialize and deserialize user
passport.serializeUser((user: any, done) => {
  process.nextTick(() => {
    done(null, { id: user.id, username: user.username });
  });
});
passport.deserializeUser(async (user: any, done) => {
  process.nextTick(() => {
    done(null, user);
  });
});

// routes
app.use("/", indexRouter); // base page - login/ register
app.use("/", profileRouter);
app.use("/", appRouter);

// last catch for errors
app.use(
  (
    err: any,
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    console.error(err);
    res.status(500).send("Internal server error master weasel");
  }
);

app.listen(port, () => {
  console.log(`⚡️[weasel-server.ts]: running @ http://localhost:${port}`);
});

export default app;

// compile with tsc in root
