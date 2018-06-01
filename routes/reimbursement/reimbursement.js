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

router.get("/menu", (req, res) => {
  res.render("./main-menu/reimbursement/reimbursement-menu");
});

router.post("/", upload.single("image"), (req, res) => {
  console.log(req.body);
  const reimbursementData = {};
  fs.readFile(req.file.path, (err, data) => {
    if (err) {
      req.flash("error", err.message);
      res.redirect("back");
    }
    reimbursementData.foto = Buffer.from(data).toString("base64");
    res.send(Buffer.from(reimbursementData.foto, "base64").toString());
  });

  reimbursementData.projectName = req.body.project;
  reimbursementData.description = req.body.description;
});

module.exports = router;
