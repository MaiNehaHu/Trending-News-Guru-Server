const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  postBy: {
    type: String,
    required: true,
  },
  postByEmployeeID: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  location: {
    code: {
      type: String,
    },
    name: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  tags: {
    type: [String],
    required: true,
  },
  imageURL: {
    type: String,
    required: true,
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
