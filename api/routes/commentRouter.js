const express = require('express');
const { ObjectId } = require('mongoose').Types;
const Post = require('../models/Post');
const { checkAuthenticated } = require('../app');
const {
  checkAndSanitizeInput,
  handleInputCheck,
} = require('../app');

const router = express.Router();

router.post('/Comment',
  checkAuthenticated,
  checkAndSanitizeInput(),
  handleInputCheck,
  (req, res) => {
    if (req.body.method === 'add') {
      const { username } = req.user;
      const { postId } = req.body;
      const { text } = req.body;

      const comment = {
        username,
        datetime: Date.now(),
        text,
        mentions: [],
      };

      Post.findOneAndUpdate(
        { _id: ObjectId(postId) },
        { $push: { comments: comment } },
      )
        .then(() => {
          res.sendStatus(201);
        })
        .catch((err) => {
          res.status(550);
          res.json(`[!] Could not add comment: ${err}`);
        });
    }
    if (req.body.method === 'delete') {
      const { username } = req.user;
      const { postId } = req.body;
      const { commentId } = req.body;

      Post.findOneAndUpdate(
        { _id: ObjectId(postId) },
        { $pull: { comments: { username, _id: ObjectId(commentId) } } },
      )
        .then(() => {
          res.sendStatus(200);
        })
        .catch((err) => {
          res.status(550);
          res.json(`[!] Could not delete comment: ${err}`);
        });
    }
    if (req.body.method === 'edit') {
      const { username } = req.user;
      const { postId } = req.body;
      const { commentId } = req.body;
      const { text } = req.body;

      Post.findOneAndUpdate(
        { _id: ObjectId(postId), comments: { $elemMatch: { _id: ObjectId(commentId), username } } },
        { $set: { 'comments.$.text': text } },
      )
        .then(() => {
          res.sendStatus(200);
        })
        .catch((err) => {
          res.status(550);
          res.json(`[!] Could not edit comment: ${err}`);
        });
    }
  });

router.post('/editComment',
  checkAuthenticated,
  checkAndSanitizeInput(),
  handleInputCheck,
  (req, res) => {
    const { username } = req.user;
    const { postId } = req.body;
    const { commentId } = req.body;
    const { text } = req.body;

    Post.findOneAndUpdate(
      { _id: ObjectId(postId), comments: { $elemMatch: { _id: ObjectId(commentId), username } } },
      { $set: { 'comments.$.text': text } },
    )
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        res.status(550);
        res.json(`[!] Could not edit comment: ${err}`);
      });
  });

module.exports = router;
