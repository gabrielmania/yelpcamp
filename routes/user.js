const express = require("express");
const passport = require("passport");
const reviews = require("../controllers/users");

const router = express.Router();

router.route("/register").get(reviews.renderRegister).post(reviews.register);

router
  .route("/login")
  .get(reviews.renderLogin)
  .post(
    passport.authenticate("local", {
      failureFlash: true,
      failureRedirect: "/login",
    }),
    reviews.login
  );

router.get("/logout", reviews.logout);

module.exports = router;
