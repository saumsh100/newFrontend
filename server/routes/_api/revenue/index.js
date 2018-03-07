
import moment from 'moment';
import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import jsonapi from '../../util/jsonapi';
import { calcRevenueDays } from '../../../lib/revenue/';

const { namespaces } = require('../../../config/globals');

const revenueRouter = Router();

/**
 * Calculates the total revenue based on a selected date and a range of 12 days.
 *
 */
revenueRouter.get('/totalRevenueDays', checkPermissions('revenue:read'), async (req, res, next) => {
  try {
    const {
      date,
    } = req.query;

    const totalRevenue = await calcRevenueDays(req.accountId, moment(date).subtract(12, 'days'), date);
    res.status(200).send({ data: totalRevenue });
  } catch (error) {
    next(error);
  }
});

module.exports = revenueRouter;
