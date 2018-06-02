const middleware = {};

middleware.isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === "Admin") {
      next();
    } else {
      req.flash("error", "Sorry you do not have permission to visit that page");
      res.redirect("back");
    }
  } else {
    req.flash("error", "You need to logged in to visit that page");
    res.redirect("/user/login");
  }
};

middleware.isSales = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === "Sales") {
      next();
    } else {
      req.flash("error", "You do not have permission to do that");
      res.redirect("back");
    }
  } else {
    req.flash("error", "You're need to logged in to visit that page");
    res.redirect("/user/login");
  }
};

middleware.isSalesOrProgrammer = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === "Sales" || req.user.role === "Programmer") {
      next();
    } else {
      req.flash("error", "You do not have permission to do that");
      res.redirect("back");
    }
  } else {
    req.flash("error", "You need to logged in to visit that page");
    res.redirect("/user/login");
  }
};

middleware.isLoggedIn = (req, res, next) => {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("error", "You need to logged in to visit that page");
    res.redirect("/user/login");
  }
};

module.exports = middleware;
