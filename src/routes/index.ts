import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
const router = express.Router();
// import passport from '/middleware/passport';

// this is the main homepage - should serve login
router.get("/", function (req: Request, res: Response, next: NextFunction) {
  res.render("index");
});

router.post(
  "/login/password",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/app",
    failureRedirect: "/",
    failureMessage: true,
  })
);

export default router;
