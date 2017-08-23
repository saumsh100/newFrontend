
import { Router } from 'express';
import { Review } from '../../../_models';
import { sequelizeLoader } from '../../util/loaders';

const reviewsRouter = Router();

reviewsRouter.param('accountId', sequelizeLoader('account', 'Account'));
reviewsRouter.param('reviewId', sequelizeLoader('review', 'Review'));

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
 * - 201 sends down the created review data
 * - 404 :accountId does not exist
 */
reviewsRouter.post('/:accountId', async (req, res, next) => {
  try {
    const { account } = req;
    const reviewData = Object.assign({}, req.body, { accountId: account.id });
    const review = await Review.create(reviewData);
    res.status(201).send(review.get({ plain: true }));
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /:reviewId
 *
 * - 200 sends updated review
 * - 404 review with :reviewId does not exist
 */
reviewsRouter.put('/:reviewId', async (req, res, next) => {
  try {
    const { review } = req;
    const updatedReview = await review.update(req.body);
    res.send(updatedReview.get({ plain: true }));
  } catch (err) {
    next(err);
  }
});

export default reviewsRouter;
