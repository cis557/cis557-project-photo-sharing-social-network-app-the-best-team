const bcrypt = require('bcryptjs');
const express = require('express');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const { passport } = require('../app');
const { parser } = require('../app');
const { checkNotAuthenticated } = require('../app');

const authRouter = express.Router();

authRouter.post('/register', checkNotAuthenticated, parser.single('image'), async (req, res) => {
  try {
    const defaultImg = fs.readFileSync(path.join(__dirname, 'public/images/default-profile.png'));
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const incomingUser = {
      _id: Date.now().toString(),
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      password: hashedPassword,
      username: req.body.username,
      posts: [],
      followers: [],
      followees: [],
      image: Buffer.from(defaultImg, 'base64'),
      likes: [],
    };

    User.findOne({ email: incomingUser.email })
      .then((user) => {
        if (user) {
          // Email address is already in use
          res.sendStatus(400);
        } else {
          User.findOne({ username: incomingUser.username })
            .then((userTwo) => {
              if (userTwo) {
                // Username is already in use
                res.sendStatus(400);
              } else {
                if (req.file) {
                  let bytes;
                  try {
                    const img = fs.readFileSync(req.file.path);
                    bytes = img.toString('base64');
                    fs.unlinkSync(req.file.path);
                  } catch (error) {
                    // Error while reading profile picture
                    res.sendStatus(500);
                  }
                  incomingUser.image = Buffer.from(bytes, 'base64');
                }

                const newUser = new User({
                  _id: incomingUser.id,
                  firstName: incomingUser.firstname,
                  lastName: incomingUser.lastname,
                  email: incomingUser.email,
                  password: incomingUser.password,
                  posts: incomingUser.posts,
                  followers: incomingUser.followers,
                  followees: incomingUser.followees,
                  image: incomingUser.image,
                  username: incomingUser.username,
                  likes: incomingUser.likes,
                });

                newUser.save()
                  .then(() => {})
                  .catch((err) => console.log(err));

                res.sendStatus(200);
              }
            });
        }
      });
  } catch (error) {
    // Error while registering
    res.sendStatus(500);
  }
});

authRouter.post('/login', checkNotAuthenticated, passport.authenticate('local',
  (req, res) => {
    res.sendStatus(200);
  },
  (req, res) => {
    res.sendStatus(400);
  }));

module.exports = authRouter;
