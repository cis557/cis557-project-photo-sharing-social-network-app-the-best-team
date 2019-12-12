const express = require('express');
const fs = require('fs');
const path = require('path');
const User = require('../models/User');
const { checkAuthenticated } = require('../app');
const { sendDatabaseErrorResponse } = require('../app');

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
        res.json(`[!] User not found: ${username}`);
      }
    })
    .catch((err) => sendDatabaseErrorResponse(err, res));
});


router.get('/getOtherUser/:username', checkAuthenticated, (req, res) => {
  const { username } = req.params;

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
        res.json(`[!] User not found: ${username}`);
      }
    })
    .catch((err) => sendDatabaseErrorResponse(err, res));
});

router.get('/getSuggestedUsers', checkAuthenticated, async (req, res) => {
  const { username } = req.user;

  const suggestedUsers = new Set();
  const followeeSet = new Set();
  const numSuggestions = 5;

  const user = await User.findOne({ username });

  if (!user) {
    res.status(550).json(`[!] Could not find user: ${username}`);
  }

  // Keep track of who the user already follows,
  // to make sure they don't get suggested to the user.
  user.followees.forEach((followeeUsername) => {
    followeeSet.add(followeeUsername);
  });

  user.followees.forEach(async (followeeUsername) => {
    const followee = await User.findOne({ username: followeeUsername })
      .catch((err) => sendDatabaseErrorResponse(err, res));
    const followeesOfFollowee = followee.followees;

    // Iterate over the followees of the followee.
    for (let i = 0; i < followeesOfFollowee.length; i += 1) {
      // If enough suggestions have been selected, break.
      if (suggestedUsers.size >= numSuggestions) {
        break;
      }

      // If the user isn't already following the followee-of-followee,
      // add them to the set of suggested users.
      if (!followeeSet.has(followeesOfFollowee[i])) {
        suggestedUsers.add(followeesOfFollowee[i]);
      }
    }
  });

  if (suggestedUsers.size < numSuggestions) {
    // At this point, all of the user's followees have been visited,
    // but not enough suggestions have been generated.
    const allUsers = await User.find()
      .catch((err) => sendDatabaseErrorResponse(err, res));

    for (let j = 0; j < allUsers.length; j += 1) {
      // Add random users to fill out the list of suggestions.
      if (!followeeSet.has(allUsers[j].username)) {
        suggestedUsers.add(allUsers[j].username);
      }

      // If enough suggestions have been selected, break.
      if (suggestedUsers.size >= numSuggestions) {
        break;
      }
    }
  }

  // Send the list of suggestions.
  res.status(200);
  res.send(Array.from(suggestedUsers));
});

module.exports = router;
