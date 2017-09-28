
import { Router } from 'express';
import { Review, SentReview, sequelize } from '../../../_models';
import { sequelizeLoader } from '../../util/loaders';
import { readFile, replaceJavascriptFile } from '../../../util/file';
import StatusError from '../../../util/StatusError';
import normalize from '../../_api/normalize';

const sentReviewsRouter = Router();

sentReviewsRouter.param('sentReviewJoinId', sequelizeLoader('sentReview', 'SentReview', [
  { association: 'review', required: false },
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
    const { review } = sentReview;
    res.send({ sentReview, review });
  } catch (err) {
    next(err);
  }
});

export default sentReviewsRouter;
