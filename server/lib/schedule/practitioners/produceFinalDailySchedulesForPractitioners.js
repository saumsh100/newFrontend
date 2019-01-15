
import fetchStaticDataForAvailabilities from '../../availabilities/fetchStaticDataForAvailabilities';
import fetchDynamicDataForAvailabilities from '../../availabilities/fetchDynamicDataForAvailabilities';
import computeOpeningsAndAvailabilities
  from '../../availabilities/computeOpeningsAndAvailabilities';

/**
 * Compute and generate the daily schedule data for practitioners.
 *
 * @param accountId
 * @param serviceId
 * @param practitionerId
 * @param startDate
 * @param endDate
 * @returns {Promise<data.practitionersData>}
 */
export default async function generateDailySchedulesForPractitioners({
  accountId,
  serviceId,
  practitionerId,
  startDate,
  endDate,
}) {
  const {
    account,
    service,
    practitioners,
  } = await fetchStaticDataForAvailabilities({
    accountId,
    serviceId,
    practitionerId,
  });

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

  const { practitionersData } = computeOpeningsAndAvailabilities({
    account: accountWithData,
    service,
    practitioners: practitionersWithData,
    chairs,
    startDate,
    endDate,
  });

  return practitionersData;
}

