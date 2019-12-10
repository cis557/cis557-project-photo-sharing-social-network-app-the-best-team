/* eslint-disable no-underscore-dangle */
const express = require('express');
const fs = require('fs');
const { ObjectId } = require('mongoose').Types;
const Post = require('../models/Post');
const User = require('../models/User');
const { parser } = require('../app');
const { checkAuthenticated } = require('../app');
const {
  checkAndSanitizeInput,
  handleInputCheck,
  checkFileSize,
  maxFileMb,
} = require('../app');

const router = express.Router();

// The steps are:
//    1. Upload image to the server-side file system.
//    2. Cache the image's bytes.
//    3. Delete the image from the server-side file system.
// Ideally, the app would skip #1 and #3, instead getting the bytes directly from the request.
// However, #1 and #3 appear to be necessary, at least based on readily available documentation.
router.post('/addPost',
  checkAuthenticated,
  parser.single('image'),
  checkAndSanitizeInput(),
  handleInputCheck,
  (req, res) => {
    let image;

    const { username } = req.user;
    const { title } = req.body;
    const { description } = req.body;
    const { privacy } = req.body;
    let { tags } = req.body;
    const { file } = req;

    const contentType = file.mimetype;

    try {
      if (file && !checkFileSize(file)) {
        res.status(413).json(`[!] Image is too large (max = ${maxFileMb}MB)`);
        return;
      }

      image = fs.readFileSync(file.path).toString('base64');
      fs.unlinkSync(file.path);
    } catch (err) {
      res.status(551);
      res.send(`[!] Could not read image: ${err}`);
      return;
    }

    image = Buffer.from(image, 'base64');
    const datetime = Date.now().toString();

    tags = tags.split(/[, ]+/);
    const validatedTags = new Set();

    User.find()
      .then((userArray) => {
        const userSet = new Set();

        userArray.forEach((user) => {
          userSet.add(user.username);
        });

        tags.forEach((tag) => {
          if (userSet.has(tag)) {
            validatedTags.add(tag);
          }
        });

        const newPost = new Post({
          username,
          datetime,
          image,
          contentType,
          title,
          description,
          privacy,
          likes: [],
          tags: Array.from(validatedTags),
          comments: [],
        });

        newPost.save()
          .then((post) => {
            User.findOneAndUpdate(
              { username },
              { $push: { posts: { id: post._id, time: post.datetime } } },
            )
              .then(() => {
                res.sendStatus(201);
              })
              .catch((err) => {
                res.status(550);
                res.json(`[!] Could not create post: ${err}`);
              });
          })
          .catch((err) => {
            res.status(550);
            res.json(`[!] Could not create post: ${err}`);
          });
      });
  });

router.post('/editPost',
  checkAuthenticated,
  checkAndSanitizeInput(),
  handleInputCheck,
  (req, res) => {
    const { username } = req.user;
    const { postId } = req.body;
    const { title } = req.body;
    const { description } = req.body;

    Post.findOneAndUpdate(
      { _id: ObjectId(postId), username },
      { $set: { title, description } },
    )
      .then(() => {
        res.sendStatus(200);
      })
      .catch((err) => {
        res.status(550);
        res.json(`[!] Could not edit post: ${err}`);
      });
  });

router.get('/getFeed', checkAuthenticated, (req, res) => {
  const { username } = req.user;
  const feed = new Set();

  User.findOne({ username })
    .then((user) => {
      if (user) {
        user.posts.forEach((post) => {
          feed.add({ id: post.id.toString('hex'), time: post.time });
        });

        const numFollowees = user.followees.length;
        if (numFollowees > 0) {
          let numFolloweesVisited = 0;
          user.followees.forEach((followeeUsername) => {
            User.findOne({ username: followeeUsername })
              .then((followee) => {
                followee.posts.forEach((post) => {
                  if(post.privacy === 'public'){
                  feed.add({ id: post.id.toString('hex'), time: post.time });
                  }
                });
              })
              .then(() => {
                numFolloweesVisited += 1;
                if (numFolloweesVisited >= numFollowees) {
                  res.status(200);
                  res.send(Array.from(feed));
                }
              });
          });
        } else {
          res.status(200);
          const array = Array.from(feed);
          array.sort((a, b) => a.time - b.time);
          res.send(array);
        }
      } else {
        res.status(404);
        res.json('[!] User not found');
      }
    })
    .catch((err) => {
      res.status(550);
      res.json(`[!] Could not retrieve user: ${err}`);
    });
});

router.get('/getPost/:postId', checkAuthenticated, (req, res) => {
  const { postId } = req.params;

  Post.findOne({ _id: ObjectId(postId) }, (err, postInDatabase) => {
    if (!postInDatabase) {
      res.status(404);
      res.json(`[!] Could not find post: ${postId}`);
    } else if (err) {
      res.status(550);
      res.json(`[!] Could not retrieve post: ${err}`);
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
  });
});

router.post('/deletePost', checkAuthenticated, (req, res) => {
  const { username } = req.user;
  const { postId } = req.body;

  Post.deleteOne({ _id: ObjectId(postId), username })
    .then(() => {
      User.findOneAndUpdate(
        { username },
        { $pull: { posts: { id: ObjectId(postId) } } },
      ).then(() => {
        res.sendStatus(200);
      });
    })
    .catch((err) => {
      res.status(550);
      res.json(`[!] Could not delete post: ${err}`);
    });
});

module.exports = router;
