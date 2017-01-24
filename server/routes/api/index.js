/**
 * Created by jsharp on 2016-11-22.
 *
 *      Varafy Inc.
 *
 */

const axios = require('axios');
const apiRouter = require('express').Router();
const db = require('../../config/db');
const sessionRouter = require('./session');
const appointmentRouter = require('./appointment');
const reputationRouter = require('./reputation');
const patientsRouter = require('./patients');
const practitionersRouter = require('./practitioners');
const userRouter = require('./users');
const textMessagesRouter = require('./textMessages');
const chairsRouter = require('./chair');
const servicesRouter = require('./services');
const availabilitiesRouter = require('./availabilities');
const authMiddleware = require('../../middleware/auth');

apiRouter.use('/appointments', authMiddleware, appointmentRouter);
apiRouter.use('/reputation', authMiddleware, reputationRouter);
apiRouter.use('/session', sessionRouter);
apiRouter.use('/patients', patientsRouter);
apiRouter.use('/chairs', chairsRouter);
apiRouter.use('/services', servicesRouter);
apiRouter.use('/practitioners', practitionersRouter);
apiRouter.use('/textMessages', textMessagesRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/availabilities', availabilitiesRouter);

module.exports = apiRouter;
