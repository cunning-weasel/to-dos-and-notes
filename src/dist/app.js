"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const passport_1 = __importDefault(require("passport"));
const passport_local_1 = require("passport-local");
const express_session_1 = __importDefault(require("express-session"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const profile_1 = __importDefault(require("./routes/profile"));
const app_1 = __importDefault(require("./routes/app"));
const index_1 = __importDefault(require("./routes/index"));
const db_1 = require("./models/db");
const encryption_1 = require("./models/encryption");
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT;
// view engine
app.set("views", path_1.default.join(__dirname, "views"));
app.set("view engine", "pug");
// middleware
app.use((0, helmet_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: false }));
// middleware for serving static files (CSS, images, etc.)
app.use("/public", express_1.default.static(path_1.default.join(__dirname, "public"), {
    setHeaders: (res, path) => {
        if (path.endsWith(".css")) {
            res.setHeader("Content-Type", "text/css");
        }
    },
}));
// passport middleware
app.use((0, express_session_1.default)({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store: new db_1.customSqLiteStore(),
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.authenticate("session"));
// define passport strategy
passport_1.default.use(new passport_local_1.Strategy((username, password, done) => __awaiter(void 0, void 0, void 0, function* () {
    if ((0, db_1.openDb)()) {
        try {
            const user = yield (0, db_1.getUserName)(username);
            if (!user) {
                return done(null, false, {
                    message: "Incorrect username.",
                });
            }
            const isPasswordMatched = (0, encryption_1.comparePassword)(password, username);
            if (!isPasswordMatched) {
                return done(null, false, {
                    message: "Incorrect password.",
                });
            }
            // if authentication success, return user
            return done(null, user);
        }
        catch (err) {
            return done(err);
        }
    }
    (0, db_1.closeDb)();
})));
// serialize and deserialize user
passport_1.default.serializeUser((user, done) => {
    process.nextTick(() => {
        done(null, { id: user.id, username: user.username });
    });
});
passport_1.default.deserializeUser((user, done) => __awaiter(void 0, void 0, void 0, function* () {
    process.nextTick(() => {
        done(null, user);
    });
}));
// routes
app.use("/", index_1.default); // base page - login/ register
app.use("/", profile_1.default);
app.use("/", app_1.default);
app.listen(port, () => {
    console.log(`⚡️[weasel-server.ts]: running @ http://localhost:${port}`);
});
exports.default = app;
// compile with tsc in root
