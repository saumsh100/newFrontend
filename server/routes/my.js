const express = require('express');
const { getHost } = require('../utils');

// For debug only, it will redirect the page to the API webpage (if external)
const getMyRouter = (subDomain = false) => {
  const myRouter = express.Router();
  const { protocol, host, port } = getHost();
  const apiURL = `${protocol}://${subDomain ? 'my.' : ''}${host}${port}`;

  myRouter.get('(/*)?', (req, res, next) => {
    res.redirect(`${apiURL}/my${req.url}`);
  });

  return myRouter;
};

module.exports = getMyRouter;
