import express, { Request, Response } from "express";
const router = express.Router();
// import passport from '/middleware/passport';

// this is the main homepage - should serve login
router.get("/", function (req: Request, res: Response) {
  res.render("index");
});


export default router;
