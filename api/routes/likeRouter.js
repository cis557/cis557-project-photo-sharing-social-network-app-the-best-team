const express = require('express');
const { ObjectId } = require('mongoose').Types;
const Post = require('../models/Post');
const User = require('../models/User');
const { checkAuthenticated } = require('../app');

const router = express.Router();

router.post('/like/:postId', checkAuthenticated, (req, res) => {
  const { username } = req.user;
  const { postId } = req.params;

  Post.findOneAndUpdate(
    { _id: ObjectId(postId) },
    { $push: { likes: username } },
  )
    .then(() => {
      User.findOneAndUpdate(
        { username },
        { $push: { likes: postId } },
      )
        .then(() => {
          res.sendStatus(200);
        })
        .catch((err) => {
          res.status(500);
          res.send(`[!] Could not like post: ${err}`);
        });
    })
    .catch((err) => {
      res.status(500);
      res.send(`[!] Could not like post: ${err}`);
    });
});

router.delete('/like/:postId', checkAuthenticated, (req, res) => {
  const { username } = req.user;
  const { postId } = req.params;

  Post.findOneAndUpdate(
    { _id: ObjectId(postId) },
    { $pull: { likes: username } },
  )
    .then(() => {
      User.findOneAndUpdate(
        { username },
        { $pull: { likes: postId } },
      )
        .then(() => {
          res.sendStatus(200);
        })
        .catch((err) => {
          res.status(500);
          res.send(`[!] Could not unlike post: ${err}`);
        });
    })
    .catch((err) => {
      res.status(500);
      res.send(`[!] Could not unlike post: ${err}`);
    });
});

module.exports = router;
