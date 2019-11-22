const mongoose = require('mongoose');

const CommentSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  username: {
    type: String,
    required: true,
  },
  datetime: {
    type: Number,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  mentions: {
    type: Array,
    required: false,
  },
});

const PostSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
  },
  datetime: {
    type: Number,
    required: true,
  },
  image: {
    type: Buffer,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },
  description: {
    type: String,
    required: false,
  },
  likes: {
    type: Array,
    required: false,
  },
  tags: {
    type: Array,
    required: false,
  },
  comments: [CommentSchema],
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
