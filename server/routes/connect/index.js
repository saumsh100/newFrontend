
/* eslint-disable consistent-return */
import { Router } from 'express';
import fs from 'fs';
import authRouter from './auth';
import { validatePhoneNumber } from '../../util/validators';
import { sequelizeLoader } from '../util/loaders';
import normalize from '../_api/normalize';

const connectRouter = new Router();

connectRouter.use('/auth', authRouter);

connectRouter.param('accountId', sequelizeLoader('account', 'Account'));
connectRouter.param('patientUserId', sequelizeLoader('patientUser', 'PatientUser'));
connectRouter.param('accountIdJoin', sequelizeLoader('account', 'Account', [
  { association: 'services', required: false, where: { isHidden: { $ne: true } }, order: [['name', 'ASC']] },
  { association: 'practitioners', required: false, where: { isActive: true } },
]));

connectRouter.get('/accounts/:accountId', async (req, res, next) => {
  // TODO: send SPA for connector config and sync monitoring
  res.send(req.account.id);
});

// Very important we catch all other endpoints,
// or else express-subdomain continues to the other middlewares
connectRouter.use('(/*)?', (req, res, next) => {
  // TODO: this needs to be wrapped in try catch
  return res.status(404).end();
});

export default connectRouter;
