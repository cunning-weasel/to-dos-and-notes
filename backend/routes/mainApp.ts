import express, { Express, Request, Response } from "express";
const router = express.Router();
import {
  getToDos,
  auth,
  addToDos,
  deleteToDos,
  updateToDos,
} from "/controllers/mainApp_controller";

router.get("/app", function (req: Request, res: Response) {
  res.render("mainApp");
});

router.route("/app").get(getToDos).post(auth, addToDos);
router
  .route("/:id")  // email?
  .get(getToDos)
  .delete(auth, deleteToDos)
  .put(auth, updateToDos);

export default router;
