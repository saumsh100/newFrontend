
import isArray from 'lodash/isArray';
import updateLastProcedureForPatients from './updateLastProcedureForPatients';
import logger from '../../config/logger';

/**
 * updateLastProcedureForAccount is an async function that acts as a simple wrapper
 * around the updateLastProcedureForPatients function to handle logging so that it can
 * be used by the events process and the patientCache cron job
 *
 * @param config
 * @return {Promise<*>}
 */
export default async function updateLastProcedureForAccount(config) {
  const {
    account,
    patientIds,
    procedureCodes,
    procedureAttr,
    procedureApptAttr,
    isCron,
  } = config;

  logger.info(
    `Updating ${procedureAttr} for ` +
    (isArray(patientIds) ?
      `${patientIds.length} patients with recently changed info ` :
      'all patients '
    ) +
    `at ${account.name} via ` +
    (isCron ?
      'cron...' :
      'events.'
    )
  );

  return updateLastProcedureForPatients({
    accountId: account.id,
    patientIds,
    procedureAttr,
    procedureApptAttr,
    procedureCodes,
  });
}
