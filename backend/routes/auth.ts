import express, { Express, Request, Response } from "express";
const router = express.Router();
// import passport from '/middleware/passport';

router.get("/", function (req: Request, res: Response) {
  res.render("index");
});

export default router;
