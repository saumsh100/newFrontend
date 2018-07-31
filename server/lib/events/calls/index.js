import { Call } from '../../../_models';

export async function fetchCallEvents({ patientId, accountId, query }) {
  return Call.findAll({
    raw: true,
    where: {
      patientId,
      accountId,
    },
    attributes: [
      'id',
      'createdAt',
      'recording',
      'duration',
      'answered',
      'callerCity',
      'callSource',
      'startTime',
    ],
    order: [['createdAt', 'DESC']],
    ...query,
  });
}

export function buildCallEvent({ data }) {
  return {
    id: Buffer.from(`call-${data.id}`).toString('base64'),
    type: 'Call',
    metaData: data,
  };
}
