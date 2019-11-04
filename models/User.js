const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  posts: {
    type: Array,
    required: false,
  },
  followers:{
    type: Array,
    required: false,
  },
  followees:{
    type: Array,
    required: false,
  },
  // likes:{
  //   type: Array,
  //   required: false,
  // }
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
