
import { Request } from '../../../_models';

export async function fetchRequestEvents({ patient, accountId, query }) {
  if (!patient.patientUserId) {
    return [];
  }

  return Request.findAll({
    raw: true,
    where: {
      accountId,
      patientUserId: patient.patientUserId,
    },
    attributes: ['id', 'createdAt', 'startDate', 'note', 'isConfirmed', 'isCancelled'],
    order: [['createdAt', 'DESC']],
    ...query,
  });
}

export function buildRequestEvent({ data }) {
  return {
    id: Buffer.from(`request-${data.id}`).toString('base64'),
    type: 'request',
    metaData: data,
  };
}
