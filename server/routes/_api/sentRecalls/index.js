
import moment from 'moment';
import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { SentRecall } from '../../../_models';
import StatusError from '../../../util/StatusError';

const sentRecallsRouter = Router();

sentRecallsRouter.param('sentRecallId', sequelizeLoader('sentRecall', 'SentRecall'));

/**
 * Get all Recalls under a clinic
 */
sentRecallsRouter.get('/', checkPermissions('sentRecalls:read'), (req, res, next) => {
  const {
    accountId,
    includeArray,
    query,
  } = req;


  let {
    startDate,
    endDate,
  } = query;

  const include = includeArray.map((included) => {
    if (included.as === 'recall') {
      return {
        ...included,
        required: true,
      };
    }
    return included;
  });

  return SentRecall.findAll({
    raw: true,
    nest: true,
    where: {
      accountId,
      isSent: true,
      createdAt: {
        $gte: moment().startOf('day').toISOString(),
      },
    },
    include,
  }).then(sentRecalls => res.send(normalize('sentRecalls', sentRecalls)))
    .catch(next);
});

module.exports = sentRecallsRouter;
