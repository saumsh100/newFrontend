
import { Router } from 'express';
import searchForAvailabilities from '../../../lib/availabilities/searchForAvailabilities';
import { sequelizeLoader } from '../../util/loaders';

const availabilitiesRouter = new Router();

availabilitiesRouter.param('accountId', sequelizeLoader('account', 'Account'));

/**
 * Availabilities API
 */
availabilitiesRouter.get('/accounts/:accountId/availabilities', async (req, res, next) => {
  try {
    const { availabilities, nextAvailability } = await searchForAvailabilities({
      ...req.query,
      accountId: req.account.id,
      maxRetryAttempts: 10,
      numDaysJump: 7,
    });

    return res.send({ availabilities, nextAvailability });
  } catch (err) {
    return next(err);
  }
});

module.exports = availabilitiesRouter;
