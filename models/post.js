const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const Comments = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref:"User"
  },
});

var today  = new Date();

const postSchema = new Schema({
  title: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref:"User"
  },
  caption: {
    type: String,
    required: true,
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

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
