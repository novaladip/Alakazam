const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const ProjectSchema = {
  name: {
    type: String,
    required: true
  },
  client_name: {
    type: String,
    required: true
  },
  created: {
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
};

module.exports = mongoose.model("Project", ProjectSchema);
