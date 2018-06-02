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

// @route   GET /reimbursement/menu
// @desc    Rendering reimbursement-menu
// @access  Only sales & programmer
router.get("/menu", middleware.isLoggedIn, (req, res) => {
  const query =
    req.user.role === "Admin" ? null : { "createBy.id": req.user._id }; // If user !== Admin, only showing reimbursement that created by current user.
  let totalExpense = 0;
  Reimbursement.find(query)
    .sort({ createDate: -1 })
    .exec()
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
router.post(
  "/",
  middleware.isSalesOrProgrammer,
  upload.single("image"),
  (req, res) => {
    fs.readFile(req.file.path, async (err, data) => {
      if (err) {
        res.redirect("back");
        console.log(err);
      }
      const reimbursementData = {
        projectName: req.body.projectName,
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
          res.redirect("/reimbursement/menu");
        })
        .catch(err => {
          req.flash("error", err.message);
          res.redirect("/reimbursement/menu");
        });
    });
  }
);

// router.post("/", upload.single("image"), (req, res) => {

// const reimbursementData = {
//   projectName: req.body.projectName,
//   description: req.body.description,
//   expense: req.body.expense,
//   date: req.body.date,
//   createBy: {
//     id: req.user._id,
//     name: req.user.name
//   }
// };

// Reimbursement.create(reimbursementData)
//   .then(createdReimbursement => {
//     req.flash(
//       "success",
//       `Reimbursement claim for ${
//         createdReimbursement.projectName
//       } has been added, it will be approve/decline by Admin ASAP.`
//     );
//     res.redirect("/reimbursement/menu");
//   })
//   .catch(err => {
//     req.flash("error", err.message);
//     res.redirect("/reimbursement/menu");
//   });
// });

// @route   GET /reimbursement/:id/approve
// @desc    Approve reimbursement status
// @access  Only sales & programmer
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
