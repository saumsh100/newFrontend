import { SentRecall, Recall } from '../../../_models';

export async function fetchRecallEvents({ patientId, accountId, query }) {
  return SentRecall.findAll({
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
    attributes: ['id', 'createdAt', 'isHygiene', 'primaryType'],
    order: [['createdAt', 'DESC']],
    ...query,
  });
}

export function buildRecallEvent({ data }) {
  return {
    id: Buffer.from(`recall-${data.id}`).toString('base64'),
    type: 'Recall',
    metaData: data,
  };
}
