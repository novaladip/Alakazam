const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new Schema({
  email: {
    type: String
  },
  password: {
    type: String
  },
  name: {
    type: String,
    minlength: 2,
    maxlength: 45
  },
  role: {
    type: String,
    required: true
  },
  createDate: {
    type: Date,
    default: Date.now
  },
  createBy: {
    name: {
      type: String,
      require: true
    },
    id: {
      type: String,
      require: true
    }
  }
});

const option = {
  usernameField: "email"
};

UserSchema.plugin(passportLocalMongoose, option);
module.exports = mongoose.model("User", UserSchema);
