const express = require('express');
const User = require('../models/User');
const { checkAuthenticated } = require('../app');

const router = express.Router();

router.post('/follow', checkAuthenticated, async (req, res) => {
  // User A will follow User B
  // User A --[FOLLOW]--> User B

  try {
    const { usernameA } = req.body;
    const { usernameB } = req.body;
    const { followeesA } = req.body;
    const { followersB } = req.body;

    if (!followeesA.includes(usernameB)) {
      followeesA.push(usernameB);
      followersB.push(usernameA);

      await User.findOneAndUpdate(
        { username: usernameA },
        { $set: { followees: followeesA } },
      );

      await User.findOneAndUpdate(
        { username: usernameB },
        { $set: { followers: followersB } },
      );
    }
  } catch (err) {
    res.status(500);
    res.send(`[!] Could not follow user: ${err}`);
  }
});

router.post('/unfollow', checkAuthenticated, async (req, res) => {
  // User A will unfollow User B
  // User A --[UNFOLLOW]--> User B

  try {
    const { usernameA } = req.body;
    const { usernameB } = req.body;
    const { followeesA } = req.body;
    const { followersB } = req.body;

    if (followeesA.includes(usernameB)) {
      followeesA.filter((username) => username === usernameB);
      followersB.filter((username) => username === usernameA);

      await User.findOneAndUpdate(
        { username: usernameA },
        { $set: { followees: followeesA } },
      );

      await User.findOneAndUpdate(
        { username: usernameB },
        { $set: { followers: followersB } },
      );
    }
  } catch (err) {
    res.status(500);
    res.send(`[!] Could not unfollow user: ${err}`);
  }
});

module.exports = router;
