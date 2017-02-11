/**
 * Created by jsharp on 2016-11-22.
 *
 *      Varafy Inc.
 *
 */

const apiRouter = require('express').Router();
const appointmentRouter = require('./appointment');
const reputationRouter = require('./reputation');
const patientsRouter = require('./patients');
const requestRouter = require('./request');
//const userRouter = require('./users');
//const textMessagesRouter = require('./textMessages');
const authMiddleware = require('../../middleware/auth');
const createJoinObject = require('../../middleware/createJoinObject');

apiRouter.all('*', authMiddleware, createJoinObject);
apiRouter.use('/appointments', appointmentRouter);
apiRouter.use('/requests', requestRouter);
apiRouter.use('/reputation', reputationRouter);
apiRouter.use('/patients', patientsRouter);
//apiRouter.use('/textMessages', textMessagesRouter);
//apiRouter.use('/users', userRouter);

module.exports = apiRouter;
