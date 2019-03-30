
import { SentRecall, Recall } from 'CareCruModels';
import groupEvents from '../helpers';

const checkGroupingFunc = (sentRecall, nextSentRecall) =>
  !sentRecall.isAutomated && !nextSentRecall.isAutomated &&
  sentRecall.interval && nextSentRecall.interval &&
  sentRecall.recall.interval === nextSentRecall.recall.interval &&
  sentRecall.primaryType !== nextSentRecall.primaryType;

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
        required: false,
      },
    ],
    attributes: [
      'id',
      'accountId',
      'patientId',
      'userId',
      'isAutomated',
      'note',
      'createdAt',
      'isHygiene',
      'primaryType',
    ],
    order: [['createdAt', 'DESC']],
    ...query,
  });

  return groupEvents(sentRecalls, checkGroupingFunc, {
    // A bit hard-coded but a simple way to ensure SMS & Emails that are sent
    // together, show up together
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
