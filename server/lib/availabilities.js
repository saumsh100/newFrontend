
require('../../server/models/relations');
const isEmpty = require('lodash/isEmpty');
const isUndefined = require('lodash/isUndefined');
const unionBy = require('lodash/unionBy');
const { r } = require('../config/thinky');
const Service = require('../models/Service');
const Practitioner = require('../models/Practitioner');
const StatusError = require('../util/StatusError');
const {
  isDuringEachother,
  createPossibleTimeSlots,
  createIntervalsFromWeeklySchedule,
} = require('../util/time');

// TODO: Currently returns if EQUAL but that
const generateDuringFilter = (m, startDate, endDate) => {
  return m('startDate').during(startDate, endDate).and(m('startDate').ne(endDate)).or(
    m('endDate').during(startDate, endDate).and(m('endDate').ne(startDate))
  );
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

  const joinObject = {
    practitioners: true,
    requests: {
      _apply: (sequence) => {
        return sequence.filter((request) => {
          return generateDuringFilter(request, startDate, endDate);
        });
      },
    },

    reservations: {
      _apply: (sequence) => {
        // Grab all reservations that were created within 3 minutes ago
        // that are requesting time within the startDate, endDate
        return sequence.filter((reservation) => {
          return reservation('dateCreated').add(60 * 3).gt(r.now()).or(
            generateDuringFilter(reservation, startDate, endDate)
          );
        });
      },
    },
  };

  // Wrap in a promise so that we can reject if certain conditions are not met (account does not own service)
  return new Promise((resolve, reject) => {
    return Service.get(serviceId).getJoin(joinObject)
      .then((service) => {
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
        const promises = practitioners.map(p => fetchPractitionerTOAndAppts(p, startDate, endDate));
        return Promise.all(promises).then(practs => resolve({ weeklySchedules, practitioners: practs }));
      })
      .catch(err => reject(err));
  });
}

function fetchPractitionersSchedules(practitioners) {
  return Promise.all(practitioners.map((practitioner) => {
    return practitioner.getWeeklySchedule();
  }));
}

function fetchPractitionerTOAndAppts(practitioner, startDate, endDate) {
  return new Promise((resolve, reject) => {
    const joinObject = {
      timeOff: {
        _apply: (sequence) => {
          return sequence.filter((timeOff) => {
            return generateDuringFilter(timeOff, startDate, endDate);
          });
        },
      },

      appointments: {
        _apply: (sequence) => {
          return sequence.filter((appt) => {
            return generateDuringFilter(appt, startDate, endDate);
          });
        },
      },
    };

    // Using getJoin as a lazy way to having appointments and timeOff ON practitioner model
    return Practitioner.get(practitioner.id).getJoin(joinObject)
      .then(p => resolve(p))
      .catch(err => reject(err));
  });
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
    startDate,
    endDate,
  } = options;

  const {
    appointments,
    timeOff,
  } = practitioner;

  const {
    requests,
    reservations,
  } = service;

  /*
   - getTimeSlots for this practitioner from startDate to endDate
   - split timeSlots up into service.duration intervals
   - loop over potential timeSlots and see if there are any conflicts with
   - requests [if no practitionerId ?], needs to know about practitioner.length
   - reservations [if no practitionerId ?], needs to know about practitioner.length
   - appointments
   */

  const practitionerRequests = requests.filter(d => d.practitionerId === practitioner.id);
  const practitionerReservations = reservations.filter(d => d.practitionerId === practitioner.id);

  // TODO: need to be able to manage these
  const noPrefRequests = requests.filter(d => isUndefined(d.practitionerId));
  const noPrefReservations = requests.filter(d => isUndefined(d.practitionerId));

  // Incorporate timeOff into this!
  const timeSlots = createIntervalsFromWeeklySchedule(weeklySchedule, startDate, endDate);
  const possibleTimeSlots = createPossibleTimeSlots(timeSlots, service.duration, 30);

  //console.log(timeSlots);
  //console.log(possibleTimeSlots);
  //console.log(appointments);

  const availabilities = possibleTimeSlots.filter((timeSlot) => {
    // see if the timeSlot conflicts with any appointments, requests or resos
    const conflictsWithAppointment = appointments.some(a => isDuringEachother(timeSlot, a));
    const conflictsWithRequests = practitionerRequests.some(pr => isDuringEachother(timeSlot, pr));
    const conflictsWithReservations = practitionerReservations.some(pr => isDuringEachother(timeSlot, pr));
    return conflictsWithAppointment || conflictsWithRequests || conflictsWithReservations;
  });

  return availabilities;
}

/**
 *
 * @param options
 */
function fetchAvailabilities(options) {
  const {
    startDate,
    endDate,
  } = options;

  return new Promise((resolve, reject) => {
    fetchServiceData(options)
      .then((service) => {
        fetchPractitionerData({ practitioners: service.practitioners, startDate, endDate })
          .then(({ weeklySchedules, practitioners }) => {
            // TODO: handle for noPreference on practitioners!
            const practitionerAvailabilities = practitioners.map((p, i) => {
              return generatePractitionerAvailabilities({
                practitioner: p,
                weeklySchedule: weeklySchedules[i],
                service,
                startDate,
                endDate,
              });
            });

            return resolve(unionBy(...practitionerAvailabilities, 'startDate'));
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
