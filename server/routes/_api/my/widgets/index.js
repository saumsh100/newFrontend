
import { Router } from 'express';
import { Review, sequelize } from '../../../../_models';
import { sequelizeLoader } from '../../../util/loaders';
import StatusError from '../../../../util/StatusError';

const reviewsRouter = Router();

reviewsRouter.param('accountId', sequelizeLoader('account', 'Account'));
reviewsRouter.param('reviewId', sequelizeLoader('review', 'Review'));
reviewsRouter.param('sentReviewId', sequelizeLoader('sentReview', 'SentReview'));

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
 * POST /:accountId/:sentReminderId
 */
reviewsRouter.post('/:accountId/:sentReviewId', async (req, res, next) => {
  try {
    const { account, sentReview } = req;
    const { stars, description } = req.body;

    // Make sure sentReview does not already have a submitted review
    if (sentReview.isCompleted && sentReview.reviewId) {
      return next(StatusError(400, 'sentReview has already been fulfilled'));
    }

    // create a transaction due to the multiple writes required
    const t = await sequelize.transaction();

    // we specifically wrap the transaction in a try/catch
    try {
      const review = await Review.create(
        {
          accountId: account.id,
          practitionerId: sentReview.practitionerId,
          patientId: sentReview.patientId,
          stars,
          description,
        },
        { transaction: t },
      );

      // Update sentReview
      await sentReview.update(
        {
          isCompleted: true,
          reviewId: review.id,
        },
        { transaction: t },
      );

      await t.commit();
      return res.status(201).send(review.get({ plain: true }));
    } catch (err) {
      await t.rollback();
      next(err);
    }
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
