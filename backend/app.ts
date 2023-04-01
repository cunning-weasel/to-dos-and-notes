import express from "express";
import dotenv from "dotenv";
import passport from "passport";
import session from "express-session";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";

import usersRouter from "./routes/users";
import mainAppRouter from "./routes/mainApp";
import authRouter from "./routes/auth";

dotenv.config();

const app = express();
const port: string = process.env.PORT;

// view engine
app.set("view engine", "pug");
// set the path to your views directory
app.set("views", path.join(__dirname, "public", "pug"));

// middleware
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// session middleware
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
    // store: new SQLite_c_store({ db: 'whatever.db', dir: './var/db' })

  })
);
// passport middleware
app.use(passport.initialize());
app.use(passport.session());
// routes
app.use("/", authRouter); // base page - login/ register
app.use("/", usersRouter);
app.use("/", mainAppRouter);

app.listen(port, () => {
  console.log(`⚡️[weasel-server.ts]: running @ http://localhost:${port}`);
});

export default app;
