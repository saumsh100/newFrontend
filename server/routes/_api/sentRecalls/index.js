
import moment from 'moment';
import { Router } from 'express';
import { sequelizeLoader } from '../../util/loaders';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { SentRecall } from '../../../_models';

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


  startDate = startDate || moment().subtract(1, 'years').toISOString();
  endDate = endDate || moment().toISOString();

  return SentRecall.findAll({
    raw: true,
    nest: true,
    where: {
      accountId,
      createdAt: {
        $lte: endDate,
        $gte: startDate,
      },
    },
    include: includeArray,
  }).then(sentRecalls => res.send(normalize('sentRecalls', sentRecalls)))
    .catch(next);
});

module.exports = sentRecallsRouter;
