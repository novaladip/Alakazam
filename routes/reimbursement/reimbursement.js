const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");
const middleware = require("../../middleware/middleware");

const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

const upload = multer({
  storage: storage
});

// Load Reimbursement Models
const Reimbursement = require("../../models/Reimbursement");
// Load Project Models
const Project = require("../../models/Project");

// @route   GET /reimbursement/menu
// @desc    Rendering reimbursement-menu
// @access  Only sales & programmer
router.get("/menu", middleware.isLoggedIn, (req, res) => {
  const query =
    req.user.role === "Admin" ? null : { "createBy.id": req.user._id }; // If user !== Admin, only showing reimbursement that created by current user.
  Reimbursement.find(query)
    .populate({ path: "projectOrProspect", select: "name _id category" })
    .sort({ createDate: -1 })
    .exec()
    .then(reimbursement => {
      res.render("main-menu/reimbursement/reimbursement-menu", {
        reimbursement: reimbursement
      });
    });
});

// @route   GET /reimbursement/add-project
// @desc    Show form to add reimbursement on project
// @access  Only sales & programmer
router.get("/add-project", middleware.isSalesOrProgrammer, (req, res) => {
  Project.find({ category: "Project" })
    .sort({ created: -1 })
    .then(projectList => {
      if (projectList.length < 1) {
        req.flash(
          "error",
          "There's no project found, so you can not claim reimbursement now."
        );
        res.redirect("back");
      }
      res.render("main-menu/reimbursement/add-project-reimbursement", {
        projectList: projectList
      });
    });
});

// @route   GET /reimbursement/add-project
// @desc    Show form to add reimbursement on prospect
// @access  Only sales & programmer
router.get("/add-prospect", middleware.isSalesOrProgrammer, (req, res) => {
  Project.find({ category: "Prospect" })
    .sort({ created: -1 })
    .then(prospectList => {
      if (prospectList.length < 1) {
        req.flash(
          "error",
          "There's no prospect found, so you can not claim reimbursement now."
        );
        res.redirect("back");
      } else {
        res.render("main-menu/reimbursement/add-prospect-reimbursement", {
          prospectList: prospectList
        });
      }
    });
});

// @route   POST /reimbursement
// @desc    Post reimbursement
// @access  Only sales & programmer
router.post(
  "/",
  middleware.isSalesOrProgrammer,
  upload.single("image"),
  (req, res) => {
    fs.readFile(req.file.path, (err, data) => {
      if (err) {
        req.flash("error", err.message);
        res.redirect("back");
      }
      const reimbursementData = {
        projectOrProspect: req.body.name,
        description: req.body.description,
        expense: req.body.expense,
        date: req.body.date,
        createBy: {
          id: req.user._id,
          name: req.user.name
        },
        foto: `data:${req.file.mimetype};base64,${Buffer.from(data).toString(
          "base64"
        )}`
      };
      Reimbursement.create(reimbursementData)
        .then(createdReimbursement => {
          req.flash(
            "success",
            `Reimbursement claim for ${
              createdReimbursement.projectName
            } has been added, it will be approve/decline by Admin ASAP!`
          );
          Project.findById(req.body.name).then(project => {
            project.reimbursementList.push(createdReimbursement);
            project.save().then(savedProject => console.log(savedProject));
          });
          res.redirect("/reimbursement/menu");
        })
        .catch(err => {
          req.flash("error", err.message);
          res.redirect("/reimbursement/menu");
        });
    });
  }
);

// @route   PUT /reimbursement/:id/approve
// @desc    Approve reimbursement status
// @access  Only admin
router.put("/:id/approve", middleware.isAdmin, (req, res) => {
  Reimbursement.findById(req.params.id)
    .then(reimbursement => {
      reimbursement.status.isApproved = true;
      reimbursement.save();
      req.flash(
        "success",
        `Reimbursement claim by ${
          reimbursement.createBy.name
        } has been approved`
      );
      res.redirect("/reimbursement/menu");
    })
    .catch(err => {
      req.flash("error", "Something went wrong, please try again later.");
      res.redirect("back");
    });
});

// @route   PUT /reimbursement/:id/decline
// @desc    decline reimbursement status
// @access  Only admin
router.put("/:id/decline", middleware.isAdmin, (req, res) => {
  Reimbursement.findById(req.params.id)
    .then(reimbursement => {
      reimbursement.status.isApproved = false;
      reimbursement.status.isDecline = true;
      reimbursement.save();
      req.flash(
        "success",
        `Reimbursement claim by ${
          reimbursement.createBy.name
        } has been declined`
      );
      res.redirect("/reimbursement/menu");
    })
    .catch(err => {
      req.flash("error", "Ooops something went wrong, please try again later.");
      res.redirect("back");
    });
});

module.exports = router;
