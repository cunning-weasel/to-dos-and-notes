"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const profile_1 = __importDefault(require("./routes/profile"));
const app_1 = __importDefault(require("./routes/app"));
const index_1 = __importDefault(require("./routes/index"));
// import SQLite_c_call from 'db/ whatever';
dotenv_1.default.config();
const app = express_1.default();
const port = process.env.PORT;
// view engine
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "pug");
// middleware
app.use(morgan_1.default("dev"));
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
app.use(cors_1.default());
app.use(express_1.default.urlencoded({ extended: false }));
// middleware for serving static files (CSS, images, etc.)
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "public"), {
    setHeaders: (res, path) => {
        if (path.endsWith(".css")) {
            res.setHeader("Content-Type", "text/css");
        }
    },
}));
// session middleware
app.use(express_session_1.default({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
    cookie: { secure: false },
}));
// passport middleware
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
// routes
app.use("/", index_1.default); // base page - login/ register
app.use("/", profile_1.default);
app.use("/", app_1.default);
app.listen(port, () => {
    console.log(`⚡️[weasel-server.ts]: running @ http://localhost:${port}`);
});
exports.default = app;
