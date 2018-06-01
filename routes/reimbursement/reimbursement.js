const express = require("express");
const router = express.Router();
const multer = require("multer");
const fs = require("fs");

const storage = multer.diskStorage({
  filename: function(req, file, callback) {
    callback(null, Date.now() + file.originalname);
  }
});

const imageFilter = (req, file, cb) => {
  // accept image files only
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/i)) {
    return cb(new Error("Only image files are allowed!"), false);
  }
  cb(null, true);
};
const upload = multer({
  storage: storage,
  fileFilter: imageFilter
});

// Load Reimbursement Models
const Reimbursement = require("../../models/Reimbursement");

// @route   GET /reimbursement/menu
// @desc    Rendering reimbursement-menu
// @access  Only sales & programmer
router.get("/menu", (req, res) => {
  let totalExpense = 0;
  Reimbursement.find()
    .sort({ createDate: -1 })
    .then(reimbursement => {
      // Filter data to get total expense from approved reimbursement claim
      const filter = reimbursement.map(data => {
        if (data.status.isApproved) totalExpense += data.expense;
      });

      res.render("main-menu/reimbursement/reimbursement-menu", {
        reimbursement: reimbursement,
        totalExpense: totalExpense
      });
    });
});

// @route   POST /reimbursement
// @desc    Post reimbursement
// @access  Only sales & programmer
router.post("/", (req, res) => {
  const reimbursementData = {
    projectName: req.body.projectName,
    description: req.body.description,
    expense: req.body.expense,
    date: req.body.date,
    createBy: {
      id: req.user._id,
      name: req.user.name
    }
  };

  Reimbursement.create(reimbursementData)
    .then(createdReimbursement => {
      req.flash(
        "success",
        `Reimbursement claim for ${
          createdReimbursement.projectName
        } has been added, it will be approve/decline by Admin ASAP.`
      );
      res.redirect("/reimbursement/menu");
    })
    .catch(err => {
      req.flash("error", err.message);
      res.redirect("/reimbursement/menu");
    });
});

// @route   GET /reimbursement/:id/approve
// @desc    Approve reimbursement status
// @access  Only sales & programmer
router.put("/:id/approve", (req, res) => {
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
      req.flash("error", err.message);
      res.redirect("back");
      console.log(err);
    });
});

router.put("/:id/decline", (req, res) => {
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
      req.flash("error", err.message);
      res.redirect("back");
      console.log(err);
    });
});

module.exports = router;
