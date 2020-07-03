
import { httpClient } from '../util/httpClient';

/**
 * fetchAvailableForms is a function that will fetch the available forms for a
 * given practice
 *
 * @param accountId
 * @returns [{formData}]
 */
export default async function fetchAvailableForms({ accountId }) {
  try {
    const { data } = await httpClient().get('/api/forms', {
      params: { accountId },
    });

    return data;
  } catch (err) {
    console.error(`Failed to fetch available forms: ${err}`);
    return null;
  }
}
