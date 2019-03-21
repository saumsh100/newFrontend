
import graphQLClient from '../../../util/graphQLClient';
import patientNotesQuery from './patientNotesQuery';

export async function fetchNoteEvents({ patientId, accountId, query }) {
  try {
    const { data: { data: { patientNotes } } } = await graphQLClient({
      variables: { patientId },
      query: patientNotesQuery(),
    });

    return patientNotes;
  } catch (err) {
    console.error(`Could not load patientNotes for ${patientId}`, err);

    // Fail gracefully, let the other events continue on
    return [];
  }
}

export function buildNoteEvent({ data }) {
  return {
    id: Buffer.from(`note-${data.id}`).toString('base64'),
    type: 'note',
    metaData: {
      ...data,
      createdAt: data.date,
    },
  };
}
