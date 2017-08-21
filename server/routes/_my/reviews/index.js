
import { Router } from 'express';
// import { Review } from '../../../models';
import loaders from '../../util/loaders';

const reviewsRouter = Router();

reviewsRouter.param('accountId', loaders('account', 'Account'));

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
