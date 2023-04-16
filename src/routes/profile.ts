import express, { Request, Response, NextFunction } from "express";
const router = express.Router();

router.get("/profile", function (req: Request, res: Response, next: NextFunction) {
  res.render("profile");
});

export default router;
