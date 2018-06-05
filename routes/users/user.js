const express = require("express");
const router = express.Router();
const passport = require("passport");
const middleware = require("../../middleware/middleware");

// Load User Models
const User = require("../../models/User");

// @route   GET /user/user-management
// @desc    Rendering user-management page
// @access  Only Admin
router.get("/management", middleware.isAdmin, (req, res) => {
  // Find all user
  User.find()
    .sort({ createDate: -1 })
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
    createBy: {
      name: req.user.name,
      id: req.user._id
    }
  };
  User.register(userData, req.body.password)
    .then(userCreated => {
      req.flash(
        "success",
        `Successfully create a new user for ${userCreated.name}`
      );
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
    failureRedirect: "/user/login",
    failureFlash: {
      type: "error",
      message: "Invalid Email or password."
    }
  }),
  (req, res) => {
    res.redirect("/");
  }
);

// @route   GET /user/logout
// @desc    Logging out user
// @access  Public
router.get("/logout", (req, res) => {
  if (req.isAuthenticated()) {
    req.flash("success", `Logged out out! See you soon ${req.user.name}`);
    req.logout();
    res.redirect("/");
  } else {
    res.redirect("/");
  }
});

// @route   DELETE /user/:user_id
// @desc    Deleting user account
// @access  Only admin
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
