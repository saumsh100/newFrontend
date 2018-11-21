
/* eslint-disable consistent-return */
import { Router } from 'express';
import authRouter from './auth';
import { sequelizeLoader } from '../util/loaders';
import apiRouter from '../_api';

const connectRouter = new Router();

connectRouter.use('/auth', authRouter);
connectRouter.use('/api', apiRouter);

connectRouter.param('accountId', sequelizeLoader('account', 'Account'));
connectRouter.param('patientUserId', sequelizeLoader('patientUser', 'PatientUser'));
connectRouter.param('accountIdJoin', sequelizeLoader('account', 'Account', [
  { association: 'services', required: false, where: { isHidden: { $ne: true } }, order: [['name', 'ASC']] },
  { association: 'practitioners', required: false, where: { isActive: true } },
]));

// Very important we catch all other endpoints,
// or else express-subdomain continues to the other middlewares
connectRouter.use('(/*)?', (req, res, next) => {
  try {
    return res.render('connect');
  } catch (err) {
    next(err);
  }
});

export default connectRouter;
