const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema({
  datetime: {
    type: Number,
    required: true,
  },
  contentType: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  image: {
    type: Buffer,
    required: true,
  },
  likes: {
    type: Array,
    required: false,
  },
  comments: {
    type: Array,
    required: false,
  },
});

const Post = mongoose.model('Post', PostSchema);

module.exports = Post;
