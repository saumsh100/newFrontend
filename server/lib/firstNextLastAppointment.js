const moment = require('moment');

function CalcFirstNextLastAppointment(apps, callback) {
  const today = new Date();

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

    while (i < apps.length && currentPatient === apps[i].patientId) {
      count += 1;

      const startDate = apps[i].startDate;

      if (moment(startDate).isAfter(today)) {
        nextApptDate = apps[i].startDate;
        nextApptId = apps[i].id;
      } else if (moment(startDate).isBefore(today) && count === 1) {
        lastApptDate = apps[i].startDate;
        lastApptId = apps[i].id;

        firstApptDate = apps[i].startDate;
        firstApptId = apps[i].id;
      } else if (moment(startDate).isBefore(today) && !lastApptDate) {
        lastApptDate = apps[i].startDate;
        lastApptId = apps[i].id;

        firstApptId = null;
      }

      i += 1;
    }

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

      callback(currentPatient, appointmentsObj);
    }

    j = i;
  }
}

module.exports = CalcFirstNextLastAppointment;
