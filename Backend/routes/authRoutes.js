const express = require("express");
const passport = require("passport");
const userController = require("../controllers/userController");
const authRouter = express.Router();

authRouter.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

authRouter.get(
  "/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect(`http://localhost:3001/login?userId=${req.user._id}`);
  }
);

authRouter.post("/register", userController.registerUser);

authRouter.post("/login", userController.loginUser);

authRouter.get("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("http://localhost:3001/");
  });
});

module.exports = authRouter;
