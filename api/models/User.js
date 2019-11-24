const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: Buffer,
    required: false,
  },
  posts: {
    type: Array,
    required: false,
  },
  likes: {
    type: Array,
    required: false,
  },
  followers: {
    type: Array,
    required: false,
  },
  followees: {
    type: Array,
    required: false,
  },
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
