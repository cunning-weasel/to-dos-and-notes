import express, { Express, Request, Response } from "express";
const router = express.Router();
// import passport from '/middleware/passport';

router.get("/app", function (req: Request, res: Response) {
  res.render("mainApp");
});

export default router;
