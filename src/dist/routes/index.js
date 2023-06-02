"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const passport_1 = __importDefault(require("passport"));
const router = express_1.default.Router();
// import passport from '/middleware/passport';
// this is the main homepage - should serve login
router.get("/", function (req, res, next) {
    res.render("index");
});
router.post("/login/password", passport_1.default.authenticate("local", {
    successReturnToOrRedirect: "/app",
    failureRedirect: "/",
    failureMessage: true,
}));
exports.default = router;
