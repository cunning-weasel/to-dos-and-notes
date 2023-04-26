import express, { NextFunction, Request, Response } from "express";
const router = express.Router();
// import passport from '/middleware/passport';

// this is the main homepage - should serve login
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.render("index");
});

// router.post(
//   "/login/password",
//   passport.authenticate("local", {
//     successReturnToOrRedirect: "/",
//     failureRedirect: "/login",
//     failureMessage: true,
//   })
// );

export default router;
