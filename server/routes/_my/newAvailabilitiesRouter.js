
import moment from 'moment';
import { Router } from 'express';
import logger from '../../config/logger';
import { fetchAvailabilities } from '../../lib/availabilities';
import searchForAvailabilities from '../../lib/availabilities/searchForAvailabilities';
import isFeatureEnabled from '../../lib/featureFlag';
import { sequelizeLoader } from '../util/loaders';

const availabilitiesRouter = new Router();

availabilitiesRouter.param('accountId', sequelizeLoader('account', 'Account'));

/**
 * Availabilities API
 */
availabilitiesRouter.get('/accounts/:accountId/availabilities', async (req, res, next) => {
  try {
    const canUseNewAvailabilities = await isFeatureEnabled('availabilities-2.0', false, {
      userId: 'my.carecru public api',
      accountId: req.params.accountId,
    });

    if (canUseNewAvailabilities) {
      logger.info('Using NEW availabilities');
      const data = {
        ...req.query,
        accountId: req.account.id,
        maxRetryAttempts: 10,
        numDaysJump: 7,
      };

      const { availabilities, nextAvailability } = await searchForAvailabilities(data);

      res.send({
        availabilities,
        nextAvailability,
      });
    } else {
      logger.info('Using OLD availabilities');
      const data = {
        ...req.query,
        accountId: req.account.id,
        timeInterval: req.account.timeInterval,
      };

      // Fetch availabilities for date range
      const availabilities = await fetchAvailabilities(data);
      if (availabilities.length) {
        res.send({
          availabilities,
          nextAvailability: availabilities[0],
        });
      } else {
        // Since there's no availabilities, let's search a bit further to grab nextAvailability
        // Yes its a naive attempt, will be better to refactor availabilities first,
        // and have a function that does an early return
        data.startDate = data.endDate;
        data.endDate = moment(data.endDate)
          .add(10, 'weeks')
          .toISOString();
        const more = await fetchAvailabilities(data);
        res.send({
          availabilities: [],
          nextAvailability: more.length ? more[0] : null,
        });
      }
    }
  } catch (err) {
    next(err);
  }
});

module.exports = availabilitiesRouter;
