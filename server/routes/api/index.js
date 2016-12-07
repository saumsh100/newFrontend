/**
 * Created by jsharp on 2016-11-22.
 *
 *      Varafy Inc.
 *
 */

const apiRouter = require('express').Router();
const db = require('../../config/db');
const axios = require('axios');
const reputationRouter = require('./reputation')
const sessionRouter = require('./session')

// TODO: move to passport file
function authenticationMiddleware () {  
  return function (req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    res.sendStatus(403)
  }
}

const MAX_RESULTS = 100;

apiRouter.get('/availabilities', authenticationMiddleware(), (req, res, next) => {
  db.getAvailabilities(MAX_RESULTS, (err, results) => {
    if (err) next(err);
    res.send(results);
  });
});

apiRouter.use('/reputation', authenticationMiddleware(), reputationRouter)
apiRouter.use('/session', sessionRouter)

module.exports = apiRouter;
