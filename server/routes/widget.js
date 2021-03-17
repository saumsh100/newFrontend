/* eslint-disable no-unused-vars */

const express = require('express');
const { getHost } = require('../utils');
const getMyRouter = require('./my');

const widgetsRouter = express.Router();
const { protocol, host, port } = getHost();
const apiURL = `${protocol}://my.${host}${port}`;

widgetsRouter.get('/:accountIdJoin/app(/*)?', async (req, res, next) => {
  res.redirect(`${apiURL}/widgets${req.url}`);
});

widgetsRouter.get('/:accountId/cc.js', async (req, res, next) => {
  res.redirect(`${apiURL}/widgets/${req.params.accountId}/cc.js`);
});

const myWidgetRenderRouter = express.Router();
myWidgetRenderRouter.use('/widgets', widgetsRouter);
const myRouter = getMyRouter(true);
myWidgetRenderRouter.use('/my', myRouter);

// This redirect is for the `online booking` app
myWidgetRenderRouter.get('(/*)?', (req, res, next) => {
  res.redirect(`${apiURL}${req.url}`);
});

module.exports = myWidgetRenderRouter;
