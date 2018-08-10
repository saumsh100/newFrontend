
import groupBy from 'lodash/groupBy';
import { fetchAndGroupPatientsByChannelPoc } from './fetchAndGroupPatientsByChannelPoc';

/**
 * reduceSuccessAndErrors
 *
 * @param channels
 * @param patients
 * @param success
 * @param errors
 * @return { success, errors }
 */
export default async function reduceSuccessAndErrors({ account, channels, success, errors }) {
  // Now we need to further break down the success array, and add more to the errors array in meantime
  const successByChannel = groupBy(success, 'primaryType');

  // For each channel, break down the successes further
  const groupedSuccessAndErrorsByChannel = await Promise.all(channels.map(channel =>
    fetchAndGroupPatientsByChannelPoc({
      account,
      channel,
      patients: (successByChannel[channel] || []).map(s => s.patient),
    })
  ));

  // Combine the new success arrays
  success = groupedSuccessAndErrorsByChannel.reduce((finalSuccessArray, successAndErrors) =>
    [...finalSuccessArray, ...successAndErrors.success], []);

  // Combine the new and old errors arrays
  errors = groupedSuccessAndErrorsByChannel.reduce((finalErrorsArray, successAndErrors) =>
    [...finalErrorsArray, ...successAndErrors.errors], errors);

  return { success, errors };
}
