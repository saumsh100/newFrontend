import { Router } from 'express';
import { fetchAvailabilities } from '../../lib/_availabilities';
import { sequelizeLoader } from '../util/loaders';

const availabilitiesRouter = new Router();

availabilitiesRouter.param('accountId', sequelizeLoader('account', 'Account'));

/**
 * Availabilities API
 */
availabilitiesRouter.get('/accounts/:accountId/availabilities', (req, res, next) => {
  const data = Object.assign({}, req.query, {
    accountId: req.account.id,
    timeInterval: req.account.timeInterval,
  });
  console.log(data);
  return fetchAvailabilities(data)
    .then((availabilities) => {
      res.send({ availabilities });
    })
    .catch(next);
});

module.exports = availabilitiesRouter;
