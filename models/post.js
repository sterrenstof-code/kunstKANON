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

var today  = new Date();

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
    default: today.toLocaleDateString(),
  },
  comments: [Comments],
  tags: [{type: String}],
});

const Post = Mongoose.model("Post", postSchema);

module.exports = Post;
