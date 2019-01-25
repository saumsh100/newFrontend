
import keyBy from 'lodash/keyBy';
import { iso } from '@carecru/isomorphic';
import { DeliveredProcedure } from 'CareCruModels';
import {
  getAccountCronConfigurations,
  updateAccountCronConfigurations,
} from '../AccountCronConfigurations';
import { getAccountConnectorConfigurations } from '../accountConnectorConfigurations';
import updateLastProcedureForAccount from './updateLastProcedureForAccount';
import logger from '../../config/logger';

/**
 * runLastProcedureCronForAccounts is an async function that will loop over the accounts
 * and runLastProcedureCronForAccount
 *
 * @param accounts - the accounts that we want to run this job for
 * @param config - lastProcedure job configurations
 * @returns undefined (its just doing a job)
 */
export default async function runLastProcedureCronForAccounts({ accounts, ...config }) {
  for (const account of accounts) {
    await exports.runLastProcedureCronForAccount({ ...config, account });
  }
}

/**
 * runLastProcedureCronForAccount is an async function that will fetch the account configurations
 * and will determine whether to update all patients, or just the recently changed ones
 *
 * @param config.account - the account that we want to run this job for
 * @param config.cronDateName - the name of the LAST_CRON account configuration for this type of lastProcedure
 * @param config.procedureCodesName - the name of the account configuration for the procedureCodes for this type
 * @param config.procedureAttr - the patient model's last____Date attribute we want to update
 * @param config.procedureApptAttr - the patient model's last____ApptId attribute we want to update
 * @returns undefined (its just doing a job)
 */
export async function runLastProcedureCronForAccount(config) {
  try {
    const {
      account,
      cronDateName,
      procedureCodesName,
      procedureAttr,
      procedureApptAttr,
    } = config;

    // Fetch configurations that are important for the last procedures job
    const configurationsMap = await getConfigsForLastProcedure({ account, cronDateName, procedureCodesName });

    // If this cron job has already been run, only bother grabbing patients that
    // have had updated info since the last time the job completed
    const patientIds = configurationsMap.cronDate ?
      await getPatientsChangedViaDeliveredProcedures({ date: configurationsMap.cronDate, accountId: account.id }) :
      null;

    // Update the patients last procedure
    await updateLastProcedureForAccount({
      account,
      patientIds,
      procedureAttr,
      procedureApptAttr,
      ...configurationsMap,
      isCron: true,
    });

    // We grab the current timestamp because if we use the cronDate we will perpetually
    // update patients cause the differ checks for patients updatedAt since cronDate
    await updateAccountCronConfigurations({
      name: cronDateName,
      value: iso(),
    }, account.id);

    logger.info(`Completed ${procedureAttr} job for ${account.name}`);
  } catch (err) {
    const { account, procedureAttr } = config;
    logger.error(`Failed updating ${procedureAttr} for ${account.name}`);
    logger.error(err);
  }
}

/**
 * getConfigsForLastProcedure is an async function that will fetch the accountConfigurations necessary to compute the
 * lastProcedure on the patients in an account
 *
 * @param account - the account object we want to fetch the configurations for
 * @param cronDateName - the name of the LAST_CRON account configuration for this type of lastProcedure
 * @param procedureCodesName - the name of the account configuration for the procedureCodes for this type
 * @return { cronDate, procedureCodes }
 */
export async function getConfigsForLastProcedure({ account, cronDateName, procedureCodesName }) {
  const cronConfigs = await getAccountCronConfigurations(account.id);
  const accountConfigs = await getAccountConnectorConfigurations(account.id);
  const cronConfigsMap = keyBy(cronConfigs, 'name');
  const accountConfigsMap = keyBy(accountConfigs, 'name');
  return {
    cronDate: cronConfigsMap[cronDateName].value,
    procedureCodes: JSON.parse(accountConfigsMap[procedureCodesName].value),
  };
}

/**
 * getPatientsChangedViaDeliveredProcedures is an async function that is private to this
 * module that will fetch the patients that have had changed deliveredProcedures data since
 * a supplied date
 *
 * @param date
 * @param accountId
 * @return [patientIds]
 */
async function getPatientsChangedViaDeliveredProcedures({ date, accountId }) {
  const patients = await DeliveredProcedure.findAll({
    raw: true,
    group: ['patientId'],
    paranoid: false,
    attributes: ['patientId'],
    where: {
      accountId,
      $or: {
        createdAt: { $gte: date },
        updatedAt: { $gte: date },
        deletedAt: { $gte: date },
      },
    },
  });

  return patients.map(p => p.patientId);
}


