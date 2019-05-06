
import {
  Account,
  Chair,
  Practitioner,
  Service,
  WeeklySchedule,
} from 'CareCruModels';
import graphQLClient from '../../util/graphQLClient';
import reasonWeeklyHoursQuery from './reasonWeeklyHoursQuery';

/**
 * fetchStaticDataForAvailabilities is an async function that is used to fetch the non-date-range
 * data required to calculate a clinic's availabilities for a given service. Notice how there is no
 * startDate, endDate data here because when we recursively check a date-range for availabilities,
 * we don't wanna re-fetch this stuff, hence why it is
 * abstracted as its own function
 *
 * @param accountId
 * @param serviceId
 * @param practitionerId
 * @return {Promise<{
 *  account: Account,
 *  service: Service,
 *  practitioners: [Practitioner],
 *  chairs: [Chair],
 * }>}
 */
export default async function fetchStaticDataForAvailabilities({
  accountId,
  serviceId,
  practitionerId,
}) {
  const practitionerIdsQuery = practitionerId || { $not: null };
  const account = await Account.unscoped().findOne({
    where: { id: accountId },
    attributes: [
      'id',
      'unit',
      'timeInterval',
      'timezone',
      'name',
      'suggestedChairId',
      'isChairSchedulingEnabled',
    ],
    include: [
      {
        // Get the selected service
        model: Service,
        as: 'services',
        attributes: [
          'id',
          'duration',
          'bufferTime',
          'name',
          'reasonWeeklyHoursId',
        ],
        where: { id: serviceId },
        include: [
          {
            // Get the active practitioners that can deliver this service
            // We use these practitioners to fetch data
            model: Practitioner,
            as: 'practitioners',
            attributes: [
              'id',
              'isCustomSchedule',
              'weeklyScheduleId',
              'firstName',
              'lastName',
            ],
            where: {
              id: practitionerIdsQuery,
              isActive: true,
            },

            order: [['createdAt', 'ASC']],

            // Grab the weeklySchedules for the practitioners
            include: [
              {
                model: WeeklySchedule,
                as: 'weeklySchedule',
                include: [
                  { association: 'monday' },
                  { association: 'tuesday' },
                  { association: 'wednesday' },
                  { association: 'thursday' },
                  { association: 'friday' },
                  { association: 'saturday' },
                  { association: 'sunday' },
                ],

                required: false,
              },
            ],

            required: false,
          },
        ],

        required: false,
      },
      // Get all active chairIds
      {
        model: Chair,
        as: 'chairs',
        attributes: ['id'],
        where: { isActive: true },
        required: false,
      },
      // Office Hours of clinic, used as fallback in Practitioner Scheduling
      {
        model: WeeklySchedule,
        as: 'weeklySchedule',
        include: [
          { association: 'monday' },
          { association: 'tuesday' },
          { association: 'wednesday' },
          { association: 'thursday' },
          { association: 'friday' },
          { association: 'saturday' },
          { association: 'sunday' },
        ],

        required: false,
      },
    ],
  });

  // Can't use destructuring cause it loses model getter functions
  const { services, chairs } = account;
  const service = services[0];
  if (service && service.reasonWeeklyHoursId) {
    try {
      const { data: { data: { reasonWeeklyHours } } } = await graphQLClient({
        variables: { reasonWeeklyHoursId: service.reasonWeeklyHoursId },
        query: reasonWeeklyHoursQuery(),
      });
      service.reasonWeeklyHours = reasonWeeklyHours;
    } catch (e) {
      console.error(`Could not load reasonWeeklyHoursId:${service.reasonWeeklyHoursId} for serviceId:${service.id}`);
      console.error(e);
    }
  }
  const practitioners = service ? service.practitioners : [];
  return {
    // Needed to ensure we can use Object.assign and object destructuring in dependant functions
    account: account.get({ plain: true }),
    service,

    // Needed for same reason as above
    practitioners: practitioners.map(p => p.get({ plain: true })),
    chairs,
  };
}
