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

const MAX_RESULTS = 100;

apiRouter.get('/availabilities', (req, res, next) => {
  db.getAvailabilities(MAX_RESULTS, (err, results) => {
    if (err) next(err);
    res.send(results);
  });
});

apiRouter.use('/reputation', reputationRouter)
apiRouter.use('/session', sessionRouter)

module.exports = apiRouter;
