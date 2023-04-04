import express, { Request, Response } from "express";
const router = express.Router();

/* GET users listing. */
router.get("/user", function (req: Request, res: Response) {
  // res.send("rename - might not need?");
  res.render("profile");

});

export default router;

