
import graphQLClient from '../../../util/graphQLClient';
import patientFollowUpsQuery from './patientFollowUpsQuery';

export async function fetchFollowUpEvents({ patientId, accountId, query }) {
  try {
    const { data: { data: { patientFollowUps } } } = await graphQLClient({
      variables: { patientId },
      query: patientFollowUpsQuery(),
    });

    return patientFollowUps;
  } catch (err) {
    console.error(`Could not load patientFollowUps for ${patientId}`, err);

    // Fail gracefully, let the other events continue on
    return [];
  }
}

export function buildFollowUpEvent({ data }) {
  return {
    id: Buffer.from(`followUp-${data.id}`).toString('base64'),
    type: 'followUp',
    metaData: {
      ...data,
      createdAt: data.date,
    },
  };
}
