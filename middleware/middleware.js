const middleware = {};

middleware.isAdmin = (req, res, next) => {
  if (req.isAuthenticated()) {
    if (req.user.role === "Admin") {
      next();
    } else {
      req.flash(
        "error",
        "Sorry you do not have permission to visit that route"
      );
      res.redirect("back");
    }
  } else {
    req.flash("error", "You do not have permission to visit that route");
    res.redirect("back");
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
    req.flash(
      "error",
      "You're not logged in but you're trying to a salesman job"
    );
    res.redirect("/user/login");
  }
};

module.exports = middleware;
