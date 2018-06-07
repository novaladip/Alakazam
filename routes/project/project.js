const express = require("express");
const router = express.Router();
const middleware = require("../../middleware/middleware");

// Load Project Models
const Project = require("../../models/Project");

// @route   GET /project/menu
// @desc    Rendering project menu
// @access  Private
router.get("/menu", (req, res) => {
  Project.find()
    .sort({ created: -1 })
    .populate("createBy.id")
    .exec()
    .then(project => {
      res.render("./main-menu/project/project-menu", {
        project: project,
        title: "Project/Prospect Menu"
      });
    });
});

// @route   POST /project
// @desc    Post project
// @access  Only Sales
router.post("/", middleware.isSales, (req, res) => {
  const projectData = {
    name: req.body.projectName,
    client_name: req.body.clientName,
    createBy: {
      id: req.user._id,
      name: req.user.name,
      category: req.body.category
    },
    category: req.body.category
  };
  Project.create(projectData)
    .then(project => {
      req.flash(
        "success",
        `${project.name} is successfully added, good job ${req.user.name}!`
      );
      res.redirect("/project/menu");
    })
    .catch(err => {
      req.flash("error", err.message);
      res.redirect("back");
    });
});

// @route   GET /reimbursement/project/:id
// @desc    Showing project reimbursement report
// @access  Only admin
router.get("/:id", middleware.isAdmin, (req, res) => {
  Project.findById(req.params.id)
    .populate({
      path: "reimbursementList",
      select:
        "name status description expense date client_name category createDate foto createBy create"
    })
    .then(data => {
      res.render("main-menu/project/project-detail", {
        data: data,
        title: `Reimbursement Report on ${data.name} ${data.category}`
      });
    });
});

module.exports = router;
