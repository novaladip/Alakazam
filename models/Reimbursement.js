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
      default: false
    },
    isDecline: {
      type: Boolean,
      default: false
    }
  },
  foto: {
    type: String
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
