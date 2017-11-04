const moment = require('moment');

function CalcFirstNextLastAppointment(apps, callback) {
  const today = new Date();

  let j = 0;
  while (j < apps.length) {
    const currentPatient = apps[j].patientId;

    let nextAppt = null;
    let nextApptId = null;

    let lastAppt = null;
    let lastApptId = null;

    let firstApptId = null;

    let count = 0;
    let i = j;

    while (i < apps.length && currentPatient === apps[i].patientId) {
      count += 1;
      const startDate = apps[i].startDate;
      if (moment(startDate).isAfter(today)) {
        nextAppt = apps[i].startDate;
        nextApptId = apps[i].id;
      } else if (moment(startDate).isBefore(today) && count === 1) {
        lastAppt = apps[i].startDate;
        lastApptId = apps[i].id;
        firstApptId = apps[i].id;
      } else if (moment(startDate).isBefore(today) && !lastAppt) {
        lastAppt = apps[i].startDate;
        lastApptId = apps[i].id;
        firstApptId = null;
      }
      i += 1;
    }

    if (count > 1 && moment(apps[i - 1].startDate).isBefore(today)) {
      firstApptId = apps[i - 1].id;
    }

    if (currentPatient) {
      callback(currentPatient, firstApptId, nextApptId, lastApptId);
    }

    j = i;
  }
}

module.exports = CalcFirstNextLastAppointment;
