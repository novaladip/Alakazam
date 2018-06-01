const express = require("express");
const router = express.Router();
const passport = require("passport");
const middleware = require("../../middleware/middleware");

// Load User Models
const User = require("../../models/User");

// @route   GET /user/users-management
// @desc    Rendering users-management page
// @access  Only Admin
router.get("/management", middleware.isAdmin, (req, res) => {
  // Find all user
  User.find()
    .then(user => {
      res.render("./main-menu/user-management/user-management", { user: user });
    })
    .catch(err => {
      req.flash("error", "Something went wrong, please try again later.");
      res.redirect("/");
    });
});

// @route   POST /user
// @desc    Create user account
// @access  Only Admin
router.post("/", middleware.isAdmin, (req, res) => {
  let userData = {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role,
    createdBy: {
      name: req.user.name
    },
    id: req.user._id
  };
  User.register(userData, req.body.password)
    .then(userCreated => {
      req.flash("success", "Successfully added a new user account");
      res.redirect("/user/management");
    })
    .catch(err => {
      req.flash("error", "Something went wrong, please try again later");
      res.redirect("/");
    });
});

router.get("/edit/:user_id", middleware.isAdmin, (req, res) => {
  User.findById(req.params.user_id).then(foundUser => {
    res.render("./main-menu/user-management/edit-user.ejs", {
      user: foundUser
    });
  });
});

router.put("/:user_id", middleware.isAdmin, (req, res) => {
  User.findByIdAndUpdate(req.params.user_id, {
    name: req.body.name,
    email: req.body.email,
    role: req.body.role
  })
    .then(updateUser => {
      req.flash(
        "success",
        `${updateUser.name} data has been successfully updated`
      );
      res.redirect("/user/management");
    })
    .catch(err => {
      req.flash("error", "Something went wrong, please try again later.");
      res.redirect("back");
    });
});

// @route   GET /user/login
// @desc    Rendering login form
// @access  Public
router.get("/login", (req, res) => {
  res.render("./auth/login.ejs");
});

// @route   POST /user/login
// @desc    Logging in user
// @access  Public
router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/user/login"
  }),
  (req, res) => {
    res.redirect("/user/management");
  }
);

// @route   GET /user/logout
// @desc    Logging out user
// @access  Private
router.get("/logout", (req, res) => {
  if (req.isAuthenticated()) {
    req.flash("success", `Logged out out! See you soon ${req.user.name}`);
    req.logout();
    res.redirect("/user/login");
  } else {
    req.flash(
      "error",
      "Too bad to be true, you're not logged in but you trying to logging out ur self. "
    );
    res.redirect("/user/login");
  }
});

router.delete("/:user_id", middleware.isAdmin, (req, res) => {
  User.findByIdAndRemove(req.params.user_id)
    .then(deletedUser => {
      req.flash("success", `${deletedUser.name} account has been deleted`);
      res.redirect("back");
    })
    .catch(err => {
      req.flash("error", "Oops something went wrong, please try again later.");
      res.redirect("back");
    });
});

module.exports = router;
