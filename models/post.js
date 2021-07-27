const Mongoose = require("mongoose");

const Comments = new Mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  }
});

const postSchema = new Mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  caption: {
    type: String,
  },
  image: {
    type: String,
  },
  updated: {
    type: Date,
    default: Date.now,
  },
  comments: [Comments],
});

const Post = Mongoose.model("Post", postSchema);

module.exports = Post;
