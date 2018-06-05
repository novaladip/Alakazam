const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ReimbursementSchema = new Schema({
  projectOrProspect: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Project"
  },
  description: {
    type: String,
    required: true
  },
  expense: {
    type: Number,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  status: {
    isApproved: {
      type: Boolean,
      default: false
    },
    isDecline: {
      type: Boolean,
      default: false
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
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      require: true
    }
  }
});

module.exports = mongoose.model("Reimbursement", ReimbursementSchema);
