const express = require('express');
const { ObjectId } = require('mongoose').Types;
const Post = require('../models/Post');
const { checkAuthenticated } = require('../app');
const { sendDatabaseErrorResponse } = require('../app');
const {
  checkAndSanitizeInput,
  handleInputCheck,
} = require('../app');

const router = express.Router();

router.post('/comment',
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
        .catch((err) => sendDatabaseErrorResponse(err, res));
    } else if (req.body.method === 'delete') {
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
        .catch((err) => sendDatabaseErrorResponse(err, res));
    } else if (req.body.method === 'edit') {
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
        .catch((err) => sendDatabaseErrorResponse(err, res));
    } else {
      res.status(400).json('[!] Not proper method');
    }
  });

module.exports = router;
