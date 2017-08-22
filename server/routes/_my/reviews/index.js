
import { Router } from 'express';
import { Review } from '../../../_models';
import { sequelizeLoader } from '../../util/loaders';

const reviewsRouter = Router();

reviewsRouter.param('accountId', sequelizeLoader('account', 'Account'));

/**
 * GET /:accountId/embed
 *
 * - 200 serves reviews embed page
 * - 404 :accountId does not exist
 */
reviewsRouter.get('/:accountId/embed', async (req, res, next) => {
  try {
    const { account } = req;
    const rawAccount = account.get({ plain: true });
    const initialState = {
      reviews: {
        account: rawAccount,
      },
    };

    res.render('reviews', {
      account: rawAccount,
      initialState: JSON.stringify(initialState),
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /:accountId
 *
 * - 200 serves reviews embed page
 * - 404 :accountId does not exist
 */
reviewsRouter.post('/:accountId', async (req, res, next) => {
  try {
    const { account } = req;
    const reviewData = Object.assign({}, req.body, { accountId: account.id });
    console.log('reviewData', reviewData);
    const review = await Review.create(reviewData);
    res.send(201, review.get({ plain: true }));
  } catch (err) {
    next(err);
  }
});

export default reviewsRouter;
