
const apiRouter = require('express').Router();

const appointmentRouter = require('./appointment');
const reputationRouter = require('./reputation');
const patientsRouter = require('./patients');
const practitionersRouter = require('./practitioners');
const requestRouter = require('./request');
const userRouter = require('./users');
const textMessagesRouter = require('./textMessages');
const chairsRouter = require('./chair');
const chatsRouter = require('./chats');
const servicesRouter = require('./services');
const availabilitiesRouter = require('./availabilities');
const authMiddleware = require('../../middleware/auth');
const createJoinObject = require('../../middleware/createJoinObject');

apiRouter.all('*', authMiddleware, createJoinObject);
apiRouter.use('/appointments', appointmentRouter);
apiRouter.use('/requests', requestRouter);
apiRouter.use('/reputation', reputationRouter);
apiRouter.use('/patients', patientsRouter);
apiRouter.use('/chairs', chairsRouter);
apiRouter.use('/chats', chatsRouter);
apiRouter.use('/services', servicesRouter);
apiRouter.use('/practitioners', practitionersRouter);
apiRouter.use('/textMessages', textMessagesRouter);
apiRouter.use('/users', userRouter);
apiRouter.use('/availabilities', availabilitiesRouter);

module.exports = apiRouter;
