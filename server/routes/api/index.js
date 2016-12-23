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
const appointmentRouter = require('./appointment');
const reputationRouter = require('./reputation');
const patientsRouter = require('./patients');
const textMessagesRouter = require('./textMessages');
const authMiddleware = jwt({ secret: 'notsosecret' });

apiRouter.use('/appointments', authMiddleware, appointmentRouter)

apiRouter.use('/reputation', authMiddleware, reputationRouter);
apiRouter.use('/session', sessionRouter);
apiRouter.use('/patients', patientsRouter);
apiRouter.use('/textMessages', textMessagesRouter);

module.exports = apiRouter;
