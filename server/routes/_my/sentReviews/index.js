
import { Router } from 'express';
import { Appointment, Review, SentReview } from '../../../_models';
import { sequelizeLoader } from '../../util/loaders';

const sentReviewsRouter = Router();

sentReviewsRouter.param('sentReviewJoinId', sequelizeLoader('sentReview', 'SentReview', [
  { association: 'review', required: false },
  {
    model: Appointment,
    as: 'appointment',
    required: false,
    include: [{
      model: SentReview,
      as: 'sentReviews',
      where: { isCompleted: true },
      required: false,
      include: [{
        model: Review,
        as: 'review',
        required: true,
      }],
    }],
  },
]));

/**
 * POST /:accountId
 *
 * - 201 sends down the created review data
 * - 404 :accountId does not exist
 */
sentReviewsRouter.get('/:sentReviewJoinId', async (req, res, next) => {
  try {
    const { sentReview } = req;
    const { review, appointment } = sentReview;

    // If sentReview is not completed, check if it's appointment has another sentReview
    // that is completed, if so, respond with that sentReview and review combo instead
    // This can happen as we create multiple sentReviews per appointment (email & sms)
    if (!sentReview.isCompleted && appointment.sentReviews && appointment.sentReviews.length) {
      const completedSentReview = appointment.sentReviews[0];
      return res.send({ sentReview: completedSentReview, review: completedSentReview.review });
    }

    return res.send({ sentReview, review });
  } catch (err) {
    next(err);
  }
});

export default sentReviewsRouter;
