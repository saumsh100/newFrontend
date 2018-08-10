
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import { channelAttributesMap } from '../comms/util';
import { fetchPatientsFromKeyValue } from './getPatientFromCellPhoneNumber';
import groupPatientsByChannelPoc from './groupPatientsByChannelPoc';

/**
 * fetchAndGroupPatientsByChannelPoc is an async function that is used as a helper "wrapper" by other services
 * to handle fetching the patients with that channel value before passing into groupPatientsByChannelPoc
 *
 * @param account
 * @param patients
 * @param channel
 * @return { success, errors }
 */
export async function fetchAndGroupPatientsByChannelPoc({ account, patients, channel }) {
  // Grab all mobilePhoneNumbers from patients passed in to help determine PoC
  const attribute = channelAttributesMap[channel];
  const values = uniq(map(patients, attribute));

  // Fetch all and then group after for efficiency
  let patientsWithValue = await fetchPatientsFromKeyValue({
    key:
    attribute,

    // Sequelize supports ability to pass in arrays and auto-do an $in query
    value: values,
    accountId: account.id,
  });

  // Without this here, the API complains about circular JSON
  patientsWithValue = patientsWithValue.map(p => p.get({ plain: true }));
  return groupPatientsByChannelPoc({
    channel,
    patients,
    fetchedPatients: patientsWithValue,
  });
}
