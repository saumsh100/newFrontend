import moment from 'moment';
import { Patient, Appointment } from '../../../_models';


function getNextLastAppointment (patientId, accountId) {
  return Appointment.findAll({
    raw: true,
    where: {
      accountId,
      patientId,
    },
    order: [['startDate', 'DESC']],
  }).then((appointments) => {
    const today = new Date();

    let nextAppt = null;
    let lastAppt = null;

    for (let i = 0; i < appointments.length; i++) {
      const app = appointments[i];
      const startDate = app.startDate;

      if (!nextAppt && moment(startDate).isAfter(today)) {
        nextAppt = startDate;
      } else if (moment(startDate).isAfter(today) && moment(startDate).isBefore(nextAppt)) {
        nextAppt = startDate;
        break;
      }
    }

    for (let j = 0; j < appointments.length; j++) {
      const app = appointments[j];
      const startDate = app.startDate;

      if (!lastAppt && moment(startDate).isBefore(moment())) {
        lastAppt = startDate;
      } else if (moment(startDate).isBefore(today) && moment(startDate).isAfter(lastAppt)) {
        lastAppt = startDate;
        break;
      }
    }
    return {
      nextAppt,
      lastAppt,
    };
  });
};

function getFirstAppointment (patientId, accountId) {
  return Appointment.findAll({
    where: {
      accountId,
      patientId,
    },
    sort: ['startDate', 'ASC'],
    limit: 1,
    raw: true,
  });
}

function calculateFNLAppts(sub, io) {
  sub.on('data', (data) => {
    Appointment.findOne({
      where: { id: data },
      include: [
        {
          model: Patient,
          as: 'patient',
          required: true,
        },
      ],
      nest: true,
      raw: true,
    }).then((app) => {
      Appointment.count({
        where: {
          patientId: app.patient.id,
        },
      }).then((count) => {
        if (count === 1) {
          console.log('first appointment --->', data)
        } else {
          //check if firstAppointment field is filled on patient model, if not calculate first appt
          getFirstAppointment(app.patient.id, app.accountId)
            .then((firstAppt) => console.log('firstAppointment calculated', firstAppt));

          getNextLastAppointment(app.patient.id, app.accountId)
            .then((nextLast) => {
              console.log('nextlastAppoints---->', nextLast);
            });
        }
      });
    });
  });
}

export default function registerPatientsSubscriber(context, io) {
  // Need to create a new sub for every route to tell
  // the difference eg. request.created and request.ended
  const subCreated = context.socket('SUB', { routing: 'topic' });

  subCreated.setEncoding('utf8');
  subCreated.connect('events', 'appointment.created');

  calculateFNLAppts(subCreated, io);
}
