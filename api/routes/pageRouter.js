const express = require('express');

const pageRouter = express.Router();

pageRouter.get('/testAPI', (req, res) => {
  res.send('API is working properly');
});

module.exports = pageRouter;
