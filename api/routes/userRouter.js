const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const { checkAuthenticated } = require('../app');

const router = express.Router();

router.get('/user', checkAuthenticated, (req, res) => {
  const { username } = req.body;

  User.findOne({ username })
    .then((user) => {
      if (user) {
        const userExcerpt = user;
        delete userExcerpt.password;
        res.send(userExcerpt);
      } else {
        // User not found
        res.sendStatus(500);
      }
    })
    .catch((err) => {
      res.status(500);
      res.send(`[!] Could not retrieve user: ${err}`);
    });
});

router.delete('/user', checkAuthenticated, (req, res) => {
  Post.deleteMany({ email: req.user.email })
    .catch((err) => console.log(err));
  User.deleteOne({ email: req.user.email })
    .catch((err) => console.log(err));

  // TODO: The response should vary based on whether the deletion was successful.
  res.sendStatus(200);
});

router.get('/users', checkAuthenticated, (req, res) => {
  User.find({}, (err, users) => {
    const userArray = [];
    users.forEach((user) => {
      userArray.push(user);
    });
    res.send(userArray);
  });
});

module.exports = router;
