/**
 * Created by jsharp on 2016-11-22.
 *
 *      Varafy Inc.
 *
 */

const apiRouter = require('express').Router();
const reputationRouter = require('./reputation');
const patientsRouter = require('./patients');
const textMessagesRouter = require('./textMessages');

apiRouter.use('/reputation', reputationRouter);
apiRouter.use('/patients', patientsRouter);
apiRouter.use('/textMessages', textMessagesRouter);

module.exports = apiRouter;
