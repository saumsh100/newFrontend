
import moment from 'moment';
const isEmpty = require('lodash/isEmpty');
const isUndefined = require('lodash/isUndefined');
const unionBy = require('lodash/unionBy');
const { r } = require('../config/thinky');
const { Service, Practitioner, Appointment, Request, WeeklySchedule, Account, PractitionerRecurringTimeOff } = require('../_models');
const StatusError = require('../util/StatusError');
const {
  isDuringEachother,
  isDuringEachotherTimeOff,
  createPossibleTimeSlots,
  createIntervalsFromWeeklySchedule,
  getISOSortPredicate,
} = require('../util/time');

const generateDuringFilterSequelize = (startDate, endDate) => {
  return {
    $or: [
      {
        startDate: {
          gt: new Date(startDate).toISOString(),
          lt: new Date(endDate).toISOString(),
        },
      },
      {
        endDate: {
          gt: new Date(startDate).toISOString(),
          lt: new Date(endDate).toISOString(),
        },
      },
    ],
  };
};


/**
 * fetchServiceData will grab all data from the service that is necessary
 * to calculate availabilities (makes efficient use of getJoin)
 *
 * - practitioners
 * - reservations
 * - requests
 *
 * @param options
 */
function fetchServiceData(options) {
  const {
    accountId,
    serviceId,
    practitionerId,
    startDate,
    endDate,
  } = options;

  // Wrap in a promise so that we can reject if certain conditions are not met (account does not own service)
  return new Promise((resolve, reject) => {

    return Service.findOne({
      where: { id: serviceId },
      include: [
        { model: Practitioner, as: 'practitioners', raw: true },
        { model: Request, as: 'requests', raw: true },
      ],
    }).then((serviceOne) => {
      const service = serviceOne.get({ plain: true });

      if (service.accountId !== accountId) {
        return reject(StatusError(403, `This account does not have access to service with id: ${serviceId}`));
      }

      if (isEmpty(service.practitioners)) {
        return reject(StatusError(400, `Service with id: ${serviceId} has no practitioners.`));
      }

      if (!practitionerId) {
        // default to returning all practitioners that can perform this service
        return resolve(service);
      }

      // filter by practitionerId
      const filteredPractitioners = service.practitioners.filter(practitioner => (
        practitioner.id === practitionerId
      ));
      if (isEmpty(filteredPractitioners)) {
        return reject(StatusError(400, `Service has no practitioners with id: ${practitionerId}`));
      }
      service.practitioners = filteredPractitioners;
      return resolve(service);
    })
    .catch(err => reject(err));
  });
}

/**
 * fetchPractitionerData will grab all data from the practitioners necessary
 * to calculate availabilities (makes efficient use of getJoin)
 *
 * - weeklySchedules
 * - timeOff
 * - appointments
 *
 * @param options
 */
function fetchPractitionerData(options) {
  const {
    practitioners,
    startDate,
    endDate,
  } = options;

  // Fetch weeklySchedule (requires logic, so not a simple getJoin)
  // Fetch timeOff & appointments
  return new Promise((resolve, reject) => {
    // first fetch weeklySchedule because it is not handled in a getJoin
    return fetchPractitionersSchedules(practitioners)
      .then((weeklySchedules) => {
        // now get practitioner.timeOff and practitioners.appointments and resolve promise

        const promises = practitioners.map((p, i) => {
          return fetchPractitionerTOAndAppts(p, startDate, endDate);
        });
        return Promise.all(promises).then(practs => resolve({ weeklySchedules, practitioners: practs }));
      })
      .catch(err => reject(err));
  });
}

function fetchPractitionersSchedules(practitioners) {
  return Promise.all(practitioners.map((practitioner) => {
    return WeeklySchedule.findOne({ where: { id: practitioner.weeklyScheduleId }, raw: true })
    .then((weeklySchedule) => {
      if (weeklySchedule) {
        return weeklySchedule;
      }

      return Account.findOne({
        where: {
          id: practitioner.accountId,
        },
        raw: true,
        nest: true,
        include: [{ model: WeeklySchedule, as: 'weeklySchedule', raw: true }],
      }).then((account) => {
        return account.weeklySchedule;
      });
    });
  }));
}

function fetchPractitionerTOAndAppts(practitioner, startDate, endDate) {
  return new Promise((resolve, reject) => {
    // const joinObject = {
    //   timeOffs: {
    //     _apply: (sequence) => {
    //       return sequence.filter((timeOff) => {
    //         // subtract and add for start date and enddate as you can miss if longer than week.
    //         return generateDuringFilter(timeOff, moment(startDate).subtract(365, 'days').toISOString(), moment(endDate).add(365, 'days').toISOString());
    //       });
    //     },
    //   },

    //   recurringTimeOffs: {
    //     _apply: (sequence) => {
    //       return sequence.filter((timeOff) => {
    //         // subtract and add for start date and enddate as you can miss if longer than week.
    //         return generateDuringFilter(timeOff, moment(startDate).subtract(365 * 2, 'days').toISOString(), moment(endDate).add(365 * 2, 'days').toISOString());
    //       });
    //     },
    //   },

    //   // TODO: can we comment this out?
    //   appointments: {
    //     _apply: (sequence) => {
    //       return sequence.filter((appt) => {
    //         return generateDuringFilter(appt, startDate, endDate)
    //           .and(appt
    //             .hasFields('isBookable')
    //             .not()
    //             .or(appt('isBookable').eq(false)));
    //       });
    //     },
    //   },
    // };

    return Practitioner.findOne({
      where: {
        id: practitioner.id,
      },
      include: [
        {
          model: Appointment,
          as: 'appointments',
          where: {
            isBookable: false,
            ...generateDuringFilterSequelize(startDate, endDate),
          },
          required: false,
        },
        {
          model: PractitionerRecurringTimeOff,
          as: 'recurringTimeOffs',
          where: generateDuringFilterSequelize(moment(startDate).subtract(365 * 2, 'days').toISOString(), moment(endDate).add(365 * 2, 'days').toISOString()),
          required: false,
        },
      ],

    }).then(p => {
      const prac = p.get({ plain: true });
      // TODO replace with real timeOffs
      prac.timeOffs = prac.recurringTimeOffs.filter((timeOff) => {
        return !timeOff.interval;
      });

      prac.recurringTimeOffs = prac.recurringTimeOffs.filter((timeOff) => {
        return timeOff.interval;
      });

      return resolve(prac);
    });
  });
}

// Converts a model of recurring time offs to just regular time offs so it can be send to that process
function recurringTimeOffsFilter(recurringTimeOffs, timeOffs, endDate, startDate) {
  const fullTimeOffs = timeOffs.slice();

  for (let i = 0; i < recurringTimeOffs.length; i++) {
    let startDay;
    let endDay;

    if (recurringTimeOffs[i].allDay) {
      startDay = recurringTimeOffs[i].startDate;
      endDay = recurringTimeOffs[i].startDate;
    } else {
      startDay = new Date(recurringTimeOffs[i].startDate);
      const startTime = new Date(recurringTimeOffs[i].startTime);
      startDay.setHours(startTime.getHours());
      startDay.setMinutes(startTime.getMinutes());

      endDay = new Date(recurringTimeOffs[i].startDate);
      const endTime = new Date(recurringTimeOffs[i].endTime);
      endDay.setHours(endTime.getHours());
      endDay.setMinutes(endTime.getMinutes());
    }

    const start = moment(startDay);
    const end = moment(endDay);

    const dayOfWeek = moment().day(recurringTimeOffs[i].dayOfWeek).isoWeekday();

    const tmpStart = start.clone().day(dayOfWeek);
    const tmpEnd = end.clone().day(dayOfWeek);

    let count = 1;

    // test for first day of the week (seeing if it comes before or after when we changed the day of the week)

    if (tmpStart.isAfter(start, 'd') || tmpStart.isSame(start, 'd')) {
      fullTimeOffs.push({
        startDate: tmpStart.toISOString(),
        endDate: tmpEnd.toISOString(),
        practitionerId: recurringTimeOffs[i].practitionerId,
        allDay: recurringTimeOffs[i].allDay,
      });
      tmpStart.add(7, 'days');
      tmpEnd.add(7, 'days');
    } else {
      tmpStart.add(7, 'days');
      tmpEnd.add(7, 'days');

      fullTimeOffs.push({
        startDate: tmpStart.toISOString(),
        endDate: tmpEnd.toISOString(),
        practitionerId: recurringTimeOffs[i].practitionerId,
        allDay: recurringTimeOffs[i].allDay,
      });

      tmpStart.add(7, 'days');
      tmpEnd.add(7, 'days');
    }

    // loop through and create regular time offs until the end date of the requested avaliabilities

    while (tmpStart.isBefore(moment(recurringTimeOffs[i].endDate)) && tmpStart.isBefore(endDate)) {
      if ((count % recurringTimeOffs[i].interval === 0) && (count >= recurringTimeOffs[i].interval) && moment(startDate).isBefore(tmpStart)) {
        fullTimeOffs.push({
          startDate: tmpStart.toISOString(),
          endDate: tmpEnd.toISOString(),
          practitionerId: recurringTimeOffs[i].practitionerId,
          allDay: recurringTimeOffs[i].allDay,
        });
      }
      count++;
      tmpStart.add(7, 'days');
      tmpEnd.add(7, 'days');
    }
  }

  return fullTimeOffs;
}

/**
 * generatePractitionerAvailabilities is a function that will compute availabilities for
 * a practitioner. By now, we can assume all data is fetched properly and we are just computing
 *
 * @param options
 */
function generatePractitionerAvailabilities(options) {
  const {
    practitioner,
    weeklySchedule,
    service,
    timeInterval,
    startDate,
    endDate,
  } = options;

  const {
    appointments,
    timeOffs,
    recurringTimeOffs,
  } = practitioner;

  const {
    requests,
  } = service;

  // console.log(practitioner.firstName, weeklySchedule)

  // console.log('requests', requests);
  // console.log('weeklySchedule.monday', weeklySchedule.monday);

  // TODO: getTimeSlots should really be: (appts, rqsts, resos).orderBy(startDate), then get openings
  // TODO: from there, split up based on account interval and weeklySchedule

  /*
   - getTimeSlots for this practitioner from startDate to endDate
   - split timeSlots up into service.duration intervals
   - loop over potential timeSlots and see if there are any conflicts with:
   -    requests [if no practitionerId ?], needs to know about practitioner.length
   -    reservations [if no practitionerId ?], needs to know about practitioner.length
   -    appointments
   */


  const practitionerRequests = requests.filter(d => d.practitionerId === practitioner.id);

  // TODO: need to be able to manage these
  const noPrefRequests = requests.filter(d => isUndefined(d.practitionerId));
  const noPrefReservations = requests.filter(d => isUndefined(d.practitionerId));

  // Incorporate timeOff into this!
  const timeSlots = createIntervalsFromWeeklySchedule(weeklySchedule, startDate, endDate);
  const validTimeSlots = timeSlots.filter(slot => isDuringEachother(slot, { startDate, endDate }));
  const possibleTimeSlots = createPossibleTimeSlots(validTimeSlots, service.duration, timeInterval || 30);
  const finalSlots = possibleTimeSlots.filter(slot => isDuringEachother(slot, { startDate, endDate }));

  const fullTimeOffs = recurringTimeOffsFilter(recurringTimeOffs, timeOffs, endDate, startDate);

  const availabilities = finalSlots.filter((timeSlot) => {
    // see if the timeSlot conflicts with any appointments, requests or resos
    const conflictsWithAppointment = appointments.some(a => isDuringEachother(timeSlot, a));
    const conflictsWithPractitionerRequests = practitionerRequests.some(pr => isDuringEachother(timeSlot, pr));

    let conflictsWithTimeSlot = true;

    for (let i = 0; fullTimeOffs && i < fullTimeOffs.length; i++) {
      if (isDuringEachotherTimeOff(fullTimeOffs[i], timeSlot)) {
        conflictsWithTimeSlot = false;
        break;
      }
    }
    // TODO: this needs to be changed to accomodate "filling up" allowable request queue
    const conflictsWithNoPrefRequests = noPrefRequests.some(pr => isDuringEachother(timeSlot, pr));
    const conflictsWithNoPrefReservations = noPrefReservations.some(pr => isDuringEachother(timeSlot, pr));
    return !conflictsWithAppointment &&
           !conflictsWithPractitionerRequests &&
           !conflictsWithNoPrefRequests &&
           !conflictsWithNoPrefReservations &&
            conflictsWithTimeSlot;
  });

  return availabilities.map((aval) => {
    return {
      startDate: aval.startDate,
      endDate: moment(aval.startDate).add(service.duration, 'minutes').toISOString(),
    };
  });
}

// fetches appointment in the time frame for a given chair(s) and filters if they aren't any availiable

function filterByChairs(weeklySchedule, avails, pracWeeklySchedule, appointments) {
  const newAvails = [];

  // prac has no custom so has all chairs
  if (pracWeeklySchedule !== weeklySchedule.id) {
    return avails;
  }

  for (let j = 0; j < avails.length; j++) {
    const dayOfWeek = moment(avails[j].startDate).format('dddd').toLowerCase();
    const chairIds = weeklySchedule[dayOfWeek].chairIds || [];


    const isAvailiable = chairIds.some((chairId) => {
      const test = appointments.some(a => {
        return a.chairId === chairId && isDuringEachother(avails[j], a);
      });

      return !test;
    });

    if (isAvailiable) {
      newAvails.push(avails[j]);
    }
  }
  return newAvails;
}

/**
 *
 * @param options
 */
function fetchAvailabilities(options) {
  const {
    startDate,
    endDate,
    timeInterval,
  } = options;

  return new Promise((resolve, reject) => {
    fetchServiceData(options)
      .then((service) => {
        fetchPractitionerData({ practitioners: service.practitioners, startDate, endDate })
          .then(({ weeklySchedules, practitioners }) => {
            // TODO: handle for noPreference on practitioners!
            return Appointment.findAll({
              where: {
                $and: [
                  {
                    isBookable: false,
                  },
                  {
                    ...generateDuringFilterSequelize(startDate, endDate)
                  },
                ],
              },
              raw: true,
            })
              .then((appointments) => {
                const practitionerAvailabilities = practitioners.map((p, i) => {
                  const avails = generatePractitionerAvailabilities({
                    practitioner: p,
                    weeklySchedule: weeklySchedules[i],
                    service,
                    startDate,
                    timeInterval,
                    endDate,
                  });
                  return filterByChairs(weeklySchedules[i], avails, p.weeklyScheduleId, appointments);
                });

                const squashed = unionBy(...practitionerAvailabilities, 'startDate');
                const squashedAndSorted = squashed.sort(getISOSortPredicate('startDate'));
                return resolve(squashedAndSorted);
              });
          });
      })
      .catch(err => reject(err));
  });
}

module.exports = {
  fetchServiceData,
  fetchPractitionerData,
  fetchAvailabilities,
};
