import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
// import { get, post, put, remove } from "/controllers/mainApp_controller";

router.get("/app", function (req: Request, res: Response, next: NextFunction) {
  res.render("app");
});

// router.route("/app").get(getToDos).post(addToDos);
// router
//   .route("/:id") // email?
//   .get(getToDos)
//   .remove(deleteToDos)
//   .put(updateToDos);

export default router;
