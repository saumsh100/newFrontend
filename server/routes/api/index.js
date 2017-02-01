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
const userRouter = require('./users');
const textMessagesRouter = require('./textMessages');
const availabilitiesRouter = require('./availabilities');
const practitionersRouter = require('./practitioners');
const servicesRouter = require('./services');
const authMiddleware = require('../../middleware/auth');


// apiRouter.all('*', authMiddleware);
apiRouter.use('/appointments', appointmentRouter);
apiRouter.use('/reputation', reputationRouter);
apiRouter.use('/practitioners', practitionersRouter);
apiRouter.use('/patients', patientsRouter);
apiRouter.use('/services', servicesRouter);
apiRouter.use('/textMessages', textMessagesRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/availabilities', availabilitiesRouter);

module.exports = apiRouter;
