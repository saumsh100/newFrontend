
import moment from 'moment';
import logger from '../../config/logger';
import StatusError from '../../util/StatusError';
import fetchStaticDataForAvailabilities from './fetchStaticDataForAvailabilities';
import fetchDynamicDataForAvailabilities from './fetchDynamicDataForAvailabilities';
import computeOpeningsAndAvailabilities from './computeOpeningsAndAvailabilities';
import { printPractitionersData, printRange } from './helpers/print';

/**
 * searchForAvailabilities is an async function that will make attempts to find availabilities
 * given an initial date-range and some retry configurations
 *
 * @param options.accountId
 * @param options.serviceId
 * @param options.practitionerId
 * @param options.startDate
 * @param options.endDate
 * @param options.retryAttempts
 * @param options.numDaysJump
 * @return { availabilities, nextAvailability, retryAttempts }
 */
export default async function searchForAvailabilities(options) {
  const {
    accountId,
    serviceId,
    practitionerId,
    maxRetryAttempts = 0,
    numDaysJump,
    returnMore,
  } = options;

  let { startDate, endDate } = options;

  // Useful to have in the debug logs
  const startTime = Date.now();
  const { account, service, practitioners } = await fetchStaticDataForAvailabilities({
    accountId,
    serviceId,
    practitionerId,
  });

  if (!service) {
    throw StatusError(400, `service with id=${serviceId} not found for this account`);
  }

  if (!practitioners.length) {
    const text = practitionerId
      ? `practitioner with id=${practitionerId} cannot`
      : 'no practitioners can';
    throw StatusError(400, `${text} do service with id=${serviceId}`);
  }

  logger.debug(
    `Searching for availabilities for a '${service.name}' ` +
      `at '${account.name}' from ${printRange(
        {
          startDate,
          endDate,
        },
        account.timezone,
      )} in '${account.timezone}'. ` +
      `Fetched static data in ${Date.now() - startTime}ms.`,
  );

  if (service.reasonWeeklyHoursId) {
    logger.debug(`Using reasonWeeklyHoursId: ${service.reasonWeeklyHoursId}`);
  }

  if (account.isChairSchedulingEnabled) {
    logger.debug('Using Chair Scheduling');
  }

  // Since there's no availabilities in initial range, let's continuously search further
  for (let i = 0; i <= maxRetryAttempts; i++) {
    const tryNum = i + 1;

    // Bump date range if retrying
    // If it is the first try just use current range
    if (i) {
      startDate = endDate;
      endDate = moment(endDate)
        .add(numDaysJump, 'days')
        .toISOString();
    }

    const tryStartTime = Date.now();
    const {
      account: accountWithData,
      practitioners: practitionersWithData,
      chairs,
    } = await fetchDynamicDataForAvailabilities({
      account,
      practitioners,
      startDate,
      endDate,
    });

    logger.debug(
      `Try #${tryNum}: Fetched date-range-sensitive-data from ` +
        `${printRange(
          {
            startDate,
            endDate,
          },
          account.timezone,
        )} in ${Date.now() - tryStartTime}ms.`,
    );

    const computeTime = Date.now();
    const {
      availabilities,
      nextAvailability,
      practitionersData,
    } = computeOpeningsAndAvailabilities({
      account: accountWithData,
      service,
      practitioners: practitionersWithData,
      chairs,
      startDate,
      endDate,
    });

    logger.debug(
      `Try #${tryNum}: Computed availabilities in ${Date.now() -
        computeTime}ms. \n${printPractitionersData(practitionersData, account)}`,
    );

    if (availabilities.length) {
      logger.debug(`Try #${tryNum}: Found some! Total time = ${Date.now() - startTime}ms`);
      if (availabilities.some(a => !a.chairId)) {
        logger.debug(`Try #${tryNum}: WARNING - Contains availabilities without a chairId`);
      }

      return {
        availabilities: returnMore || i === 0 ? availabilities : [],
        nextAvailability,
        retryAttempts: i,
        practitionersData,
      };
    }
  }

  logger.debug(
    `Try #${maxRetryAttempts - 1}: No availabilities found. Total time = ${Date.now() -
      startTime}ms`,
  );

  // Could not find any availabilities
  return {
    availabilities: [],
    nextAvailability: null,
    retryAttempts: maxRetryAttempts,
  };
}
