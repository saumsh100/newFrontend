/**
 * Created by jsharp on 2016-11-22.
 *
 *      Varafy Inc.
 *
 */

const apiRouter = require('express').Router();
const authRouter = require('./auth');
const appointmentRouter = require('./appointment');
const reputationRouter = require('./reputation');
const patientsRouter = require('./patients');
const userRouter = require('./users');
const textMessagesRouter = require('./textMessages');
const authMiddleware = require('../../middleware/auth');

apiRouter.use('/auth', authRouter);
apiRouter.use('/appointments', authMiddleware, appointmentRouter);
apiRouter.use('/reputation', authMiddleware, reputationRouter);
apiRouter.use('/patients', patientsRouter);
apiRouter.use('/textMessages', textMessagesRouter);
apiRouter.use('/users', userRouter);

module.exports = apiRouter;
