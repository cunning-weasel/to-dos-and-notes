"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
// import { get, post, put, remove } from "/controllers/mainApp_controller";
router.get("/app", function (req, res, next) {
    res.render("app");
});
// router.route("/app").get(getToDos).post(addToDos);
// router
//   .route("/:id") // email?
//   .get(getToDos)
//   .remove(deleteToDos)
//   .put(updateToDos);
exports.default = router;
