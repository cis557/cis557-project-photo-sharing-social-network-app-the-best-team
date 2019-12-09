const express = require('express');
const fs = require('fs');
const path = require('path');
const Post = require('../models/Post');
const User = require('../models/User');
const { checkAuthenticated } = require('../app');

const router = express.Router();

router.get('/getUser', checkAuthenticated, (req, res) => {
  const { username } = req.user;

  User.findOne({ username })
    .then((userInDatabase) => {
      if (userInDatabase) {
        const userToSend = userInDatabase;

        // Don't send the user's email or password.
        userToSend.email = '';
        userToSend.password = '';
        delete userToSend.email;
        delete userToSend.password;

        // Send the profile picture as a Buffer.
        // There is no Buffer class in the browser, so it is better to do this step in the back end.
        // To display the image on the client side, set an img element's "src" to the following,
        // where "resJson" is the response from this route as a JSON object:
        // `data:image/png;base64,${btoa(String.fromCharCode.apply(null, resJson.image.data))}`
        try {
          userToSend.image = Buffer.from(userInDatabase.image, 'binary');
        } catch (err) {
          userToSend.image = fs.readFileSync(path.join(__dirname, '../public/images/default-profile.png'));
        }

        res.status(200);
        res.send(userToSend);
      } else {
        res.status(404);
        res.send(`[!] User not found: ${username}`);
      }
    })
    .catch((err) => {
      res.status(550);
      res.send(`[!] Could not retrieve user: ${err}`);
    });
});

router.delete('/deleteUser', checkAuthenticated, (req, res) => {
  const usernameLoggedIn = req.user.username;
  const usernameToDelete = req.body.username;

  if (usernameToDelete !== usernameLoggedIn) {
    res.status(401);
    res.send(`[!] Cannot delete another user: ${usernameToDelete}`);
  }

  Post.deleteMany({ username: usernameToDelete })
    .catch((err) => {
      res.status(550);
      res.send(`[!] Could not delete user: ${err}`);
    });

  User.deleteOne({ username: usernameToDelete })
    .catch((err) => {
      res.status(550);
      res.send(`[!] Could not delete user: ${err}`);
    })
    .then(() => {
      res.sendStatus(550);
    });
});

router.get('/getUsers', checkAuthenticated, (req, res) => {
  User.find().limit(5)
    .then((usersInDatabase) => {
      const usersToSend = [];

      usersInDatabase.forEach((user) => {
        usersToSend.push(user.username);
      });

      res.send(usersToSend);
    })
    .catch((err) => {
      res.status(550);
      res.send(`[!] Could not retrieve users: ${err}`);
    });
});

module.exports = router;
