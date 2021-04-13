const express = require('express');

const { onlineBookingApp } = require('../config');
const { getHtmlWithAccountInfo } = require('../helpers/utils');

const myRouter = express.Router();

myRouter.get('/my/:accountId(/*)?', async (req, res, next) => {
  try {
    const { accountId } = req.params;
    const html = await getHtmlWithAccountInfo(accountId, onlineBookingApp, 'Widget');
    res.type('html').send(html);
  } catch (e) {
    next(e);
  }
});

module.exports = myRouter;
