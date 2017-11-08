const moment = require('moment');

/**
 * CalcFirstNextLastAppointment calculates the first/last/next appointment for a patient
 * - from a list of appointments that are not cancelled, deleted, or pending
 * - sorted by patientId and startDate descending
 * - updates the patient through the callback function
 *
 * @param apps
 * @param callback
 */

function CalcFirstNextLastAppointment(apps, callback) {
  const today = new Date();

  // loops through the entire set of appointments
  let j = 0;
  while (j < apps.length) {
    const currentPatient = apps[j].patientId;

    let nextApptDate = null;
    let nextApptId = null;

    let lastApptDate = null;
    let lastApptId = null;

    let firstApptDate = null;
    let firstApptId = null;

    let count = 0;
    let i = j;

    // loops through a subset of appointments
    while (i < apps.length && currentPatient === apps[i].patientId) {
      count += 1;

      const startDate = apps[i].startDate;

      // sets the next appointment that is closest to today but in the future
      if (moment(startDate).isAfter(today)) {
        nextApptDate = apps[i].startDate;
        nextApptId = apps[i].id;

      // sets first and last appointment to be equal if there is only one past appointment
      } else if (moment(startDate).isBefore(today) && count === 1) {
        lastApptDate = apps[i].startDate;
        lastApptId = apps[i].id;

        firstApptDate = apps[i].startDate;
        firstApptId = apps[i].id;

      // set last appointment that is closest to today but in the past
      } else if (moment(startDate).isBefore(today) && !lastApptDate) {
        lastApptDate = apps[i].startDate;
        lastApptId = apps[i].id;

        firstApptId = null;
      }

      i += 1;
    }

    /**
     * if there is more than one appointment in this subset check if the
     * last appointment of this subset is in the past and then set first appointment
     */

    if (count > 1 && moment(apps[i - 1].startDate).isBefore(today)) {
      firstApptId = apps[i - 1].id;
      firstApptDate = apps[i - 1].startDate;
    }

    if (currentPatient) {
      const appointmentsObj = {
        firstApptId,
        firstApptDate,
        nextApptId,
        nextApptDate,
        lastApptId,
        lastApptDate,
      };

    // update the current patient of this subset with the calculated data in the appointments object
      callback(currentPatient, appointmentsObj);
    }

    // jump to the next subset of appointments if any
    j = i;
  }
}

module.exports = CalcFirstNextLastAppointment;
