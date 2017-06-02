
const callsRouter = require('express').Router();
const checkPermissions = require('../../../middleware/checkPermissions');
const normalize = require('../normalize');
const loaders = require('../../util/loaders');

//callsRouter.param('callId', loaders('request', 'Request'));

/**
 * Receive a call from CallRail's webhook API
 */
callsRouter.post('/', (req, res, next) => {
  try {
    console.log(req.body);
  } catch (err) {
    next(err);
  }
});


module.exports = callsRouter;
