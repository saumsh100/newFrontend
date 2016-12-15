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
const jwt = require('express-jwt')
const sessionRouter = require('./session')
const authMiddleware = jwt({secret: 'notsosecret'})

const MAX_RESULTS = 100;

apiRouter.get('/availabilities', authMiddleware, (req, res, next) => {
  db.getAvailabilities(MAX_RESULTS, (err, results) => {
    if (err) next(err);
    res.send(results);
  });
});

apiRouter.use('/reputation', authMiddleware, reputationRouter)
apiRouter.use('/session', sessionRouter)

module.exports = apiRouter;
