
import { SentRecall, Recall } from '../../../_models';
import groupEvents from '../helpers';

const checkGroupingFunc = (sentRecall, nextSentRecall) =>
  (sentRecall.recall.interval === nextSentRecall.recall.interval
    && sentRecall.primaryType !== nextSentRecall.primaryType);

export async function fetchRecallEvents({ patientId, accountId, query }) {
  const sentRecalls = await SentRecall.findAll({
    raw: true,
    nest: true,
    where: {
      isSent: true,
      patientId,
      accountId,
    },
    include: [
      {
        model: Recall,
        as: 'recall',
        attributes: ['interval'],
        required: true,
      },
    ],
    attributes: ['id', 'isAutomated', 'createdAt', 'isHygiene', 'primaryType'],
    order: [['createdAt', 'DESC']],
    ...query,
  });

  return groupEvents(sentRecalls, checkGroupingFunc, {
    primaryType: 'sms/email',
    grouped: true,
  });
}

export function buildRecallEvent({ data }) {
  return {
    id: Buffer.from(`recall-${data.id}`).toString('base64'),
    type: 'recall',
    metaData: data,
  };
}
