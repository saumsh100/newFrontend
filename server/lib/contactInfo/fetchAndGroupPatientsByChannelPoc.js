
import map from 'lodash/map';
import uniq from 'lodash/uniq';
import { channelAttributesMap } from '../comms/util';
import { getPatientListFromEmail } from './getPatientFromEmail';
import groupPatientsByChannelPoc from './groupPatientsByChannelPoc';
import { getPatientListFromCellPhoneNumber } from './getPatientFromCellPhoneNumber';

// Map of fetching function per channel
const fetchFunctionMap = {
  email: getPatientListFromEmail,
  sms: getPatientListFromCellPhoneNumber,
  phone: getPatientListFromCellPhoneNumber,
};

/**
 * fetchAndGroupPatientsByChannelPoc is an async function that is used as a helper "wrapper"
 * by other services to handle fetching the patients with that channel value before passing
 * into groupPatientsByChannelPoc
 *
 * @param account
 * @param patients
 * @param channel
 * @return { success, errors }
 */
export default async function fetchAndGroupPatientsByChannelPoc({ account, patients, channel }) {
  // Grab all mobilePhoneNumbers from patients passed in to help determine PoC
  const attribute = channelAttributesMap[channel];
  const values = uniq(map(patients, attribute));

  // Fetch all and then group after for efficiency
  const fetchedPatientsWithValue = await fetchFunctionMap[channel]({
    [attribute]: values,
    accountId: account.id,
  });

  // Without this here, the API complains about circular JSON
  const patientsWithValue = fetchedPatientsWithValue.map(p => p.get({ plain: true }));
  return groupPatientsByChannelPoc({
    channel,
    patients,
    fetchedPatients: patientsWithValue,
  });
}
