const Mongoose = require("mongoose");

const userSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  }
});

const User = Mongoose.model("User", userSchema);

module.exports = User;