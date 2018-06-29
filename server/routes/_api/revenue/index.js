import { Router } from 'express';
import checkPermissions from '../../../middleware/checkPermissions';
import calcRevenueDays from '../../../lib/revenue/';

const revenueRouter = Router();

/**
 * Calculates the total revenue based on a selected date and a range integer
 *
 */
revenueRouter.get('/totalRevenueDays', checkPermissions('revenue:read'), async (req, res, next) => {
  try {
    const totalRevenue = await calcRevenueDays({ ...req.query, accountId: req.accountId });
    res.send({ data: totalRevenue });
  } catch (error) {
    next(error);
  }
});

module.exports = revenueRouter;
