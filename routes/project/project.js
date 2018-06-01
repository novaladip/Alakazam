const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/middleware");

// Load Project Models
const Project = require("../../models/Project");

// @route   GET /project/menu
// @desc    Rendering project menu
// @access  Private
router.get("/menu", middleware.isSales, (req, res) => {
  Project.find()
    .sort({ created: -1 })
    .populate("createBy")
    .exec()
    .then(project => {
      console.log(project);
      res.render("./main-menu/project/project-menu", { project: project });
    });
});

// @route   POST /project
// @desc    Post project
// @access  Only Sales
router.post("/", middleware.isSales, (req, res) => {
  const projectData = {
    name: req.body.projectName,
    client_name: req.body.clientName,
    createBy: req.user._id
  };
  Project.create(projectData)
    .then(project => {
      req.flash("success", `${project.name} is successfully added`);
      res.redirect("/project/menu");
    })
    .catch(err => {
      req.flash("error", err.message);
      res.redirect("back");
    });
});

module.exports = router;
