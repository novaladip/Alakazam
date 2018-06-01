const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReimbursementSchema = new Schema({
  projectName: {
    type: String,
    require: true
  },
  description: {
    type: String,
    require: true
  },
  expense: {
    type: Number,
    require: true
  },
  date: {
    type: Date,
    require: true
  },
  status: {
    isApproved: {
      type: Boolean,
      default: false,
      require: true
    },
    isDecline: {
      type: Boolean,
      default: false,
      require: true
    }
  },
  foto: {
    type: String,
    required: true
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  createBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }
});

module.exports = mongoose.model("Reimbursement", ReimbursementSchema);
