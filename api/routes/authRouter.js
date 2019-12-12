/* eslint-disable prefer-destructuring */
const bcrypt = require('bcryptjs');
const express = require('express');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const { passport } = require('../app');
const { parser } = require('../app');
const { checkAuthenticated } = require('../app');
const { checkNotAuthenticated } = require('../app');
const { sendDatabaseErrorResponse } = require('../app');
const {
  checkAndSanitizeInput,
  handleInputCheck,
  checkFileSize,
  maxFileKb,
} = require('../app');

const router = express.Router();

router.post('/register', checkNotAuthenticated,
  parser.single('image'),
  checkAndSanitizeInput(),
  handleInputCheck,
  async (req, res) => {
    const { firstName } = req.body;
    const { lastName } = req.body;
    const { email } = req.body;
    const { password } = req.body;
    const { username } = req.body;
    const { file } = req;

    if (file && !checkFileSize(file)) {
      res.status(413);
      res.json(`[!] Profile picture is too large (max = ${maxFileKb}KB)`);
      return;
    }

    if (file && file.mimetype !== 'image/jpeg' && file.mimetype !== 'image/png') {
      res.status(422);
      res.json('[!] Invalid file type (only PNG or JPEG allowed)');
      return;
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      let image = fs.readFileSync(path.join(__dirname, '../public/images/default-profile.png'));

      User.findOne({ email })
        .then((userFoundByEmail) => {
          if (userFoundByEmail) {
            res.status(409);
            res.json(`[!] Email address is already in use: ${email}`);
          } else {
            User.findOne({ username })
              .then((userFoundByUsername) => {
                if (userFoundByUsername) {
                  res.status(409);
                  res.json(`[!] Username is already in use: ${username}`);
                } else {
                  if (file) {
                    let bytes;

                    try {
                      const img = fs.readFileSync(file.path);
                      bytes = img.toString('base64');
                      fs.unlinkSync(file.path);
                    } catch (err) {
                      res.status(551);
                      res.json(`[!] Could not read profile picture: ${err}`);
                      return;
                    }

                    if (bytes) {
                      image = Buffer.from(bytes, 'base64');
                    }
                  }

                  const newUser = new User({
                    email,
                    username,
                    firstName,
                    lastName,
                    password: hashedPassword,
                    lockout: { attempts: 0, lastFailedDatetime: -1 },
                    image,
                    posts: [],
                    likes: [],
                    followers: [],
                    followees: [],
                  });

                  newUser.save()
                    .then(() => res.sendStatus(201))
                    .catch((err) => sendDatabaseErrorResponse(err, res));
                }
              });
          }
        });
    } catch (err) {
      res.status(559).json(`[!] Could not register user: ${err}`);
    }
  });

router.post('/login',
  checkNotAuthenticated,
  passport.authenticate('local'),
  (req, res) => {
    res.sendStatus(200);
  },
  (req, res) => {
    res.status(401);
    res.json('[!] Invalid credentials');
  });

router.post('/logout', checkAuthenticated, (req, res) => {
  req.logout();
  res.sendStatus(200);
});

router.get('/checkAuth', (req, res) => {
  if (req.isAuthenticated()) {
    res.sendStatus(200);
  } else {
    res.sendStatus(401);
  }
});

module.exports = router;
