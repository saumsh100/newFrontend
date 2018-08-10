
import keyBy from 'lodash/keyBy';
import isArray from 'lodash/isArray';
import logger from '../../config/logger';
import {
  Account,
  Appointment,
  AppointmentCode,
  Patient,
} from '../../_models';
import {
  getAccountCronConfigurations,
  updateAccountCronConfigurations,
} from '../AccountCronConfigurations';
import {
  getAccountConnectorConfigurations,
} from '../accountConnectorConfigurations';
import {
  updatePatientDueDate,
} from './pendingAppts';
import {
  getPatientsWithChangedDueDateInfo,
  updatePatientDueDateFromPatientRecalls,
} from './patientRecalls';

const isPendingApptCheck = ({ adapterType }) => adapterType === 'TRACKER_V11';

/**
 * getConfigsForDueDates is an async function that will return the data needed to run
 * the dueDates cron job and the real-time event handlers for dueDates
 *
 * @param account
 * @return object - data that is need to run the dueDates calculations
 */
export async function getConfigsForDueDates(account) {
  const cronConfigs = await getAccountCronConfigurations(account.id);
  const accountConfigs = await getAccountConnectorConfigurations(account.id);
  const cronConfigsMap = keyBy(cronConfigs, 'name');
  const accountConfigsMap = keyBy(accountConfigs, 'name');
  return {
    adapterType: accountConfigsMap['ADAPTER_TYPE'].value,
    cronDueDate: cronConfigsMap['CRON_DUE_DATE'].value,
    hygieneTypes: JSON.parse(accountConfigsMap['HYGIENE_TYPES'].value),
    recallTypes: JSON.parse(accountConfigsMap['RECALL_TYPES'].value),
  };
}

/**
 * updatePatientDueDatesForAccount is an async function that will updated the dueDates for
 * a patients in an account based on the account's configurations
 *
 * @param {object} config.account - the account that is having its dueDates updated
 * @param {date} config.date - the date the job is being run on
 * @param {[string]} config.adapterType - the date the job is being run on
 * @param {[uuid]} config.patientIds - the date the job is being run on
 * @param {[string]} config.hygieneTypes - the date the job is being run on
 * @param {[string]} config.recallTypes - the date the job is being run on
 * @return undefined
 */
export async function updatePatientDueDatesForAccount(config) {
  const { account, date, adapterType, patientIds, hygieneTypes, recallTypes } = config;
  const isUsingPendingAppointments = isPendingApptCheck({ adapterType });
  const isNotAllPatients = isArray(patientIds);

  logger.info(
    `Updating dueDates for ` +
    (isNotAllPatients ? `${patientIds.length} patients with recently changed dueDate info ` : 'all patients ') +
    `based on ${isUsingPendingAppointments ? 'pending appointments' : 'patient recalls'} ` +
    `for ${account.name} with ADAPTER_TYPE=${adapterType}...`,
  );

  return isUsingPendingAppointments ?
    await updatePatientDueDate(account.id, patientIds) :
    await updatePatientDueDateFromPatientRecalls({
      accountId: account.id,
      date,
      hygieneTypes,
      recallTypes,
      patientIds,
      hygieneInterval: account.hygieneInterval,
      recallInterval: account.recallInterval,
    });
}

/**
 * updatePatientDueDatesForAllAccounts is an async function that will fetch all accounts and
 * loop through all those accounts and call the updatePatientDueDatesForAccount function
 *
 * @param {date} - date the job was invoked on
 * @returns undefined
 */
export default async function updatePatientDueDatesForAllAccounts({ date }) {
  const accounts = await Account.findAll({});
  for (const account of accounts) {
    try {
      // Fetch configurations that are important for the dueDates job
      const configurationsMap = await getConfigsForDueDates(account);

      // If this cron job has already been run, only bother grabbing patients that
      // have had updated info since last job completed
      const patientIds = configurationsMap.cronDueDate ?
        await getPatientsWithChangedDueDateInfo(configurationsMap.cronDueDate, account.id) :
        null;

      // Update the patients dueDates and the last run cron's date
      await exports.updatePatientDueDatesForAccount({ account, date, patientIds, ...configurationsMap });
      await updateAccountCronConfigurations({
        name: 'CRON_DUE_DATE',
        // We grab the current timestamp because if we use the cronDate we will perpetually
        // update patients cause the differ checks for patients updatedAt since cronDate
        value: (new Date()).toISOString(),
      }, account.id);

      logger.info(`Completed dueDates for ${account.name} on ${date}.`);
    } catch (err) {
      logger.error(`Failed updating dueDates for account=${account.name} on ${date}`);
      logger.error(err);
    }
  }
}
