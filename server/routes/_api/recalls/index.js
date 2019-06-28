
import { Router } from 'express';
import moment from 'moment';
import { getDayStart, getDayEnd, convertIntervalStringToObject } from '@carecru/isomorphic';
import { renderTemplate, generateClinicMergeVars } from '../../../lib/mail';
import { getRecallTemplateName, getPreviewMergeVars } from '../../../lib/recalls/createRecallText';
import checkPermissions from '../../../middleware/checkPermissions';
import normalize from '../normalize';
import { sequelizeLoader } from '../../util/loaders';
import { Recall } from '../../../_models';
import StatusError from '../../../util/StatusError';
import { getRecallsOutboxList } from '../../../lib/recalls/helpers';
import createRecallText from '../../../lib/recalls/createRecallText'

const recallsRouter = new Router();

recallsRouter.param('accountId', sequelizeLoader('account', 'Account'));
recallsRouter.param('recallId', sequelizeLoader('recall', 'Recall'));

/**
 * GET /:accountId/recalls/:recallId/sms
 */
recallsRouter.get('/:accountId/recalls/:recallId/sms', checkPermissions('accounts:read'), async (req, res, next) => {
  try{
    
    if (req.accountId !== req.account.id) {
      return next(
        StatusError(
          403,
          "Requesting user's activeAccountId does not match account.id",
        ),
      );
    }

    const { recall, account } = req;
    
    const patient = {
      firstName: 'Jane',
      lastName: 'Doe',
    };

    const link = 'carecru.co/gg58h';

    const recallMessage = createRecallText({
      patient,
      account,
      recall,
      link,
    });
  
    res.send(recallMessage);
  } catch (error) {
    next(error);
  }
});

/**
 * GET /:accountId/recalls
 */
recallsRouter.get('/:accountId/recalls', checkPermissions('accounts:read'), async (req, res, next) => {
  // TODO: these should be on a recalls endpoint, not nested on account
  if (req.account.id !== req.accountId) {
    next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  try {
    const recalls = await Recall.findAll({
      raw: true,
      where: { accountId: req.accountId },
    });

    res.send(normalize('recalls', recalls));
  } catch (error) {
    next(error);
  }
});

/**
 * GET /:accountId/recalls/list
 */
recallsRouter.get('/:accountId/recalls/list', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    // TODO: date needs to be on the 30 minute marks
    const { account } = req;
    const date = (new Date()).toISOString();
    const recalls = await Recall.findAll({
      raw: true,
      where: { accountId: account.id },
      order: [['lengthSeconds', 'DESC']],
    });

    const data = await mapPatientsToRecalls({ recalls, account, date });
    const dataWithRecalls = data.map((d, i) => {
      return {
        ...d,
        ...recalls[i],
      };
    });

    res.send(dataWithRecalls);
  } catch (error) {
    next(error);
  }
});

/**
 * POST /:accountId/recalls
 */
recallsRouter.post('/:accountId/recalls', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.account.id !== req.accountId) {
    return next(StatusError(403, 'req.accountId does not match URL account id'));
  }

  const saveRecall = Object.assign({ accountId: req.accountId }, req.body);
  Recall.create(saveRecall)
    .then((recall) => {
      res.status(201).send(normalize('recall', recall.dataValues));
    })
    .catch(next);
});

/**
 * PUT /:accountId/recalls/:recallId
 */
recallsRouter.put('/:accountId/recalls/:recallId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.accountId !== req.account.id) {
    return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
  }

  return req.recall.update(req.body)
    .then((recall) => {
      res.send(normalize('recall', recall.dataValues));
    })
    .catch(next);
});

recallsRouter.delete('/:accountId/recalls/:recallId', checkPermissions('accounts:read'), (req, res, next) => {
  if (req.accountId !== req.account.id) {
    return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
  }
  return req.recall.destroy()
    .then(() => res.status(204).send())
    .catch(next);
});

/**
 * DELETE /:accountId/reminders/:reminderId/preview
 *
 * - purpose of this route is mainly for email templates as we have to go to mandrill
 */
recallsRouter.get('/:accountId/recalls/:recallId/preview', checkPermissions('accounts:read'), async (req, res, next) => {
  try {
    if (req.accountId !== req.account.id) {
      return next(StatusError(403, 'Requesting user\'s activeAccountId does not match account.id'));
    }

    const { account, recall } = req;
    const intervalObject = convertIntervalStringToObject(recall.interval);
    const dueDate = moment().add(intervalObject);
    const lastApptDate = dueDate.subtract(6, 'months');
    const patient = {
      firstName: 'Jane',
      lastName: 'Doe',
      lastApptDate,
      dueDate,
    };

    const templateName = getRecallTemplateName({ recall });
    const previewMergeVars = getPreviewMergeVars({ recall });
    const html = await renderTemplate({
      templateName,
      mergeVars: [
        // defaultMergeVars
        ...generateClinicMergeVars({ account, patient }),
        ...previewMergeVars,
      ],
    });

    return res.send(html);
  } catch (err) {
    console.error(err);
    return next(err);
  }
});

/**
 * GET /:accountId/outbox
 */
recallsRouter.get('/:accountId/recalls/outbox', checkPermissions('sentRecalls:read'), async (req, res, next) => {
  try {
    if (req.account.id !== req.accountId) {
      throw StatusError(403, 'req.accountId does not match URL account id');
    }

    const { account } = req;
    const { startDate = getDayStart(), endDate = getDayEnd() } = req.query;
    const outboxList = await getRecallsOutboxList({ account, startDate, endDate });
    return res.send(outboxList);
  } catch (error) {
    next(error);
  }
});

module.exports = recallsRouter;
