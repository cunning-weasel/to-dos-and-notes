import express, { Request, Response } from "express";
const router = express.Router();
// import passport from '/middleware/passport';

router.get("/index", function (req: Request, res: Response) {
  res.render("index");
});


export default router;
