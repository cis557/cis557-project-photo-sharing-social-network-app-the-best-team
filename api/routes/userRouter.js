const express = require('express');
const Post = require('../models/Post');
const User = require('../models/User');
const { checkAuthenticated } = require('../app');

const router = express.Router();

router.get('/user', checkAuthenticated, (req, res) => {
  const { username } = req.body;

  User.findOne({ username })
    .then((userInDatabase) => {
      if (userInDatabase) {
        const userToSend = userInDatabase;

        // Don't send the user's password.
        delete userToSend.password;

        // Send the profile picture as a Buffer.
        // There is no Buffer class in the browser, so it is better to do this step in the back end.
        // To display the image on the client side, set an img element's "src" to the following,
        // where "resJson" is the response from this route as a JSON object:
        // `data:image/png;base64,${btoa(String.fromCharCode.apply(null, resJson.image.data))}`
        userToSend.image = Buffer.from(userInDatabase.image, 'binary');

        res.status(200);
        res.send(userToSend);
      } else {
        res.status(500);
        res.send(`[!] User not found: ${username}`);
      }
    })
    .catch((err) => {
      res.status(500);
      res.send(`[!] Could not retrieve user: ${err}`);
    });
});

router.delete('/user', checkAuthenticated, (req, res) => {
  const usernameToDelete = req.body.username;
  const usernameLoggedIn = req.user.username;

  if (usernameToDelete !== usernameLoggedIn) {
    res.status(500);
    res.send(`[!] Cannot delete another user: ${usernameToDelete}`);
  }

  Post.deleteMany({ username: usernameToDelete })
    .catch((err) => {
      res.status(500);
      res.send(`[!] Could not delete user: ${err}`);
    });
  User.deleteOne({ username: usernameToDelete })
    .catch((err) => {
      res.status(500);
      res.send(`[!] Could not delete user: ${err}`);
    });

  res.sendStatus(200);
});

router.get('/users', checkAuthenticated, (res) => {
  User.find({}, (usersInDatabase) => {
    const usersToSend = [];

    usersInDatabase.forEach((user) => {
      usersToSend.push(user.username);
    });

    res.send(usersToSend);
  })
    .catch((err) => {
      res.status(500);
      res.send(`[!] Could not retrieve users: ${err}`);
    });
});

router.delete('/logout', checkAuthenticated, (req, res) => {
  req.logOut();
  res.sendStatus(200);
});

module.exports = router;
