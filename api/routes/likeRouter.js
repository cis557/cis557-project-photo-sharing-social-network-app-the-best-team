const express = require('express');
const { ObjectId } = require('mongoose').Types;
const Post = require('../models/Post');
const User = require('../models/User');
const { checkAuthenticated } = require('../app');

const router = express.Router();

router.post('/like', checkAuthenticated, (req, res) => {
  const { username } = req.user;
  const { method } = req.body;
  const { postId } = req.body;

  if (method === 'add') {
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
            res.sendStatus(201);
          })
          .catch((err) => {
            res.status(550);
            res.send(`[!] Could not like post: ${err}`);
          });
      })
      .catch((err) => {
        res.status(550);
        res.send(`[!] Could not like post: ${err}`);
      });
  } else if (method === 'remove') {
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
            res.status(550);
            res.send(`[!] Could not unlike post: ${err}`);
          });
      })
      .catch((err) => {
        res.status(550);
        res.send(`[!] Could not unlike post: ${err}`);
      });
  } else {
    res.status(400).send('[!] Not proper method');
  }
});

router.get('/getLikes', checkAuthenticated, (req, res) => {
  const { username } = req.user;
  const likes = new Set();

  User.findOne({ username })
    .then((user) => {
      if (user) {
        user.likes.forEach((postId) => {
          likes.add(postId);
        });
        res.status(200);
        res.send(Array.from(likes));
      } else {
        res.status(404);
        res.send('[!] User not found');
      }
    })
    .catch((err) => {
      res.status(550);
      res.send(`[!] Could not retrieve user: ${err}`);
    });
});

module.exports = router;
