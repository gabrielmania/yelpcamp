//Controller for the User routes
const User = require("../models/user");

//Request to get the register form
module.exports.renderRegister = (req, res) => {
  res.render("users/register");
};

//To post the registration
module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ username, email });
    const registeredUser = await User.register(user, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", "Welcome to Yelp Camp!");
      res.redirect("/campgrounds");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/register");
  }
};

//Request to get the login form
module.exports.renderLogin = (req, res) => {
  res.render("users/login");
};

//To post the login
module.exports.login = (req, res) => {
  req.flash("success", "Welcome back!");
  const redirectUrl = req.session.returnTo || "/campgrounds";
  delete req.session.returnTo;
  res.redirect(redirectUrl);
};

//To logout the user
module.exports.logout = (req, res, next) => {
  req.logout();
  req.flash("success", "Goodbye!");
  res.redirect("/campgrounds");
};
