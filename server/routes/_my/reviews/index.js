
import { Router } from 'express';
// import { Review } from '../../../models';
import { sequelizeLoader } from '../../util/loaders';

const reviewsRouter = Router();

reviewsRouter.param('accountId', sequelizeLoader('account', 'Account'));

/**
 * GET /reviews/:accountId/embed
 *
 * - 200 serves page
 * - 404 :accountId does not exist
 */
reviewsRouter.get('/:accountId/embed', async (req, res, next) => {
  try {
    const { account } = req;
    res.render('reviews', { account: account.get({ plain: true }) });
  } catch (err) {
    next(err);
  }
});

export default reviewsRouter;
