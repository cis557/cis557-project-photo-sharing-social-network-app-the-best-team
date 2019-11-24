const express = require('express');

const router = express.Router();

router.get('/testAPI', (req, res) => {
  res.send('API is working properly');
});

module.exports = router;
