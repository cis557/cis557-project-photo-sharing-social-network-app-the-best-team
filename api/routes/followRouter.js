const express = require('express');
const User = require('../models/User');
const { checkAuthenticated } = require('../app');
const { sendDatabaseErrorResponse } = require('../app');

const router = express.Router();

router.post('/follow', checkAuthenticated, (req, res) => {
  // User A will follow User B
  // User A --[FOLLOW]--> User B
  if (req.body.method === 'follow') {
    try {
      const usernameA = req.user.username;
      const usernameB = req.body.username;

      User.findOne({ username: usernameA })
        .then((user) => {
          const followeesA = user.followees;

          if (!followeesA.includes(usernameB)) {
          // Update User A's followees.
            User.findOneAndUpdate(
              { username: usernameA },
              { $push: { followees: usernameB } },
            )
              .then(() => {
                // Update User B's followers.
                User.findOneAndUpdate(
                  { username: usernameB },
                  { $push: { followers: usernameA } },
                )
                  .then(() => {
                    res.sendStatus(200);
                  })
                  .catch((err) => sendDatabaseErrorResponse(err, res));
              })
              .catch((err) => sendDatabaseErrorResponse(err, res));
          } else {
            res.status(400);
            res.json(`[!] Already following user: ${usernameB}`);
          }
        });
    } catch (err) {
      res.status(559).json(`[!] Could not follow user: ${err}`);
    }
  } else if (req.body.method === 'unfollow') {
    try {
      const usernameA = req.user.username;
      const usernameB = req.body.username;

      User.findOne({ username: usernameA })
        .then((user) => {
          const followeesA = user.followees;

          if (followeesA.includes(usernameB)) {
          // Update User A's followees.
            User.findOneAndUpdate(
              { username: usernameA },
              { $pullAll: { followees: [usernameB] } },
            )
              .then(() => {
                // Update User B's followers.
                User.findOneAndUpdate(
                  { username: usernameB },
                  { $pullAll: { followers: [usernameA] } },
                )
                  .then(() => {
                    res.sendStatus(200);
                  })
                  .catch((err) => sendDatabaseErrorResponse(err, res));
              })
              .catch((err) => sendDatabaseErrorResponse(err, res));
          } else {
            res.status(400).json(`[!] Not following user: ${usernameB}`);
          }
        });
    } catch (err) {
      res.status(559).json(`[!] Could not follow user: ${err}`);
    }
  } else {
    res.status(400).json('[!] Not proper method');
  }
});

module.exports = router;
