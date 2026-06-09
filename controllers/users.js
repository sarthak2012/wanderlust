const User = require("../models/user");
const wrapAsync = require("../utils/wrapAsync");

module.exports.renderSignupForm = (req, res) => {
  res.render("users/signup.ejs");
};

module.exports.signup = async (req, res) => {
  try {
    let { username, email, password } = req.body;
    let newUser = new User({ username, email });
    let registeredUser = await User.register(newUser, password);
    console.log(registeredUser);
    req.login(registeredUser, (err) => {
      if (err) {
        return next(err);
      }
      req.flash("success", "Welcome to Wanderlust!");
      res.redirect("/listings");
    });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/signup");
  }
};

module.exports.renderLoginForm = (req, res) => {
  res.render("users/login.ejs");
};

((module.exports.login = wrapAsync(async (req, res) => {
  req.flash("success", "Welcome back!");
  res.redirect(res.locals.redirectUrl || "/listings");
})),
  (req, res) => {
    req.logOut((err) => {
      if (err) {
        return next(err);
      } else {
        req.flash("success", "Logged out successfully!");
        res.redirect("/listings");
      }
    });
  });

module.exports.logout = (req, res) => {
  req.logOut((err) => {
    if (err) {
      return next(err);
    } else {
      req.flash("success", "Logged out successfully!");
      res.redirect("/listings");
    }
  });
};

