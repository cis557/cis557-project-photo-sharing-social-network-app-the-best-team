/* eslint-disable no-underscore-dangle */
const express = require('express');
const fs = require('fs');
const { ObjectId } = require('mongoose').Types;
const Post = require('../models/Post');
const User = require('../models/User');
const { parser } = require('../app');
const { checkAuthenticated } = require('../app');

const router = express.Router();

// The steps are:
//    1. Upload image to the server-side file system.
//    2. Cache the image's bytes.
//    3. Delete the image from the server-side file system.
// Ideally, the app would skip #1 and #3, instead getting the bytes directly from the request.
// However, #1 and #3 appear to be necessary, at least based on readily available documentation.
router.post('/post', checkAuthenticated, parser.single('image'), (req, res) => {
  let image;

  const { title } = req.body;
  const { description } = req.body;
  const { username } = req.user;
  const { file } = req;

  const contentType = file.mimetype;

  try {
    image = fs.readFileSync(file.path).toString('base64');
    fs.unlinkSync(file.path);
  } catch (err) {
    res.status(500);
    res.send(`[!] Could not read image: ${err}`);
  }

  image = Buffer.from(image, 'base64');
  const datetime = Date.now().toString();

  const newPost = new Post({
    username,
    datetime,
    image,
    contentType,
    title,
    description,
    likes: [],
    tags: [],
    comments: [],
  });

  newPost.save()
    .then((post) => {
      User.findOneAndUpdate(
        { username },
        { $push: { posts: post._id } },
      )
        .then(() => {
          res.sendStatus(200);
        })
        .catch((err) => {
          res.status(500);
          res.send(`[!] Could not create post: ${err}`);
        });
    })
    .catch((err) => {
      res.status(500);
      res.send(`[!] Could not create post: ${err}`);
    });
});

router.get('/post/:postId', checkAuthenticated, (req, res) => {
  const { postId } = req.params;

  Post.findOne({ _id: ObjectId(postId) }, (postInDatabase) => {
    if (postInDatabase == null) {
      res.status(500);
      res.send(`[!] Could not find post: ${postId}`);
    } else {
      // Send the image as a Buffer.
      // There is no Buffer class in the browser, so it is better to do this step in the back end.
      // To display the image on the client side, set an img element's "src" to the following,
      // where "resJson" is the response from this route as a JSON object:
      // `data:image/png;base64,${btoa(String.fromCharCode.apply(null, resJson.image.data))}`
      const postToSend = postInDatabase;
      postToSend.image = Buffer.from(postInDatabase.image, 'binary');
      res.send(postToSend);
    }
  })
    .catch((err) => {
      res.status(500);
      res.send(`[!] Could not find post: ${err}`);
    });
});

module.exports = router;
