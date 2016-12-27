/**
 * Created by jsharp on 2016-11-22.
 *
 *      Varafy Inc.
 *
 */

const axios = require('axios');
const jwt = require('express-jwt');
const apiRouter = require('express').Router();
const db = require('../../config/db');
const sessionRouter = require('./session');
const reputationRouter = require('./reputation');
const patientsRouter = require('./patients');
const userRouter = require('./users');
const textMessagesRouter = require('./textMessages');
const authMiddleware = jwt({ secret: 'notsosecret' });

const MAX_RESULTS = 100;

apiRouter.get('/availabilities', authMiddleware, (req, res, next) => {
  db.getAvailabilities(MAX_RESULTS, (err, results) => {
    if (err) next(err);
    res.send(results);
  });
});

apiRouter.use('/reputation', authMiddleware, reputationRouter);
apiRouter.use('/session', sessionRouter);
apiRouter.use('/patients', patientsRouter);
apiRouter.use('/textMessages', textMessagesRouter);
apiRouter.use('/users', authMiddleware, userRouter);

module.exports = apiRouter;
