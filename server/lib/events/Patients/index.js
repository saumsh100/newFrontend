
import moment from 'moment';
import { Patient, Appointment } from '../../../_models';


function calcFirstNextLastAppointment(patient, accountId) {
  return Appointment.findAll({
    raw: true,
    where: {
      accountId,
      patientId: patient.id,
      isCancelled: false,
      isDeleted: false,
      isPending: false,
    },
    order: [['startDate', 'DESC']],
  }).then((appointments) => {
    const today = new Date();

    let nextAppt = null;
    let lastAppt = null;
    let nextApptId = null;
    let lastApptId = null;
    let firstApptId = null;

    let count = 0;
    for (let i = 0; i < appointments.length; i += 1) {
      count += 1;
      const startDate = appointments[i].startDate;
      if (moment(startDate).isAfter(today)) {
        nextAppt = appointments[i].startDate;
        nextApptId = appointments[i].id;
      } else if (moment(startDate).isBefore(today) && count === 1) {
        lastAppt = appointments[i].startDate;
        lastApptId = appointments[i].id;
        firstApptId = appointments[i].id;
      } else if (moment(startDate).isBefore(today) && !lastAppt) {
        lastAppt = appointments[i].startDate;
        lastApptId = appointments[i].id;
        firstApptId = null;
      }
    }

    const length = appointments.length
    if (count > 1 && moment(appointments[length - 1].startDate).isBefore(today)) {
      firstApptId = appointments[length - 1].id;
    }

    patient.nextApptId = nextApptId;
    patient.lastApptId = lastApptId;
    patient.firstApptId = firstApptId;

    return Patient.update(patient, {
      where: {
        id: patient.id,
      },
    });
  });
};

function registerFirstNextLastCalc(sub, io) {
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
      calcFirstNextLastAppointment(app.patient, app.accountId);
    });
  });
}

export default function registerPatientsSubscriber(context, io) {
  // Need to create a new sub for every route to tell
  // the difference eg. request.created and request.ended
  const subCalcFNL = context.socket('SUB', { routing: 'topic' });

  subCalcFNL.setEncoding('utf8');
  subCalcFNL.connect('events', 'calcPatient.FNL');

  registerFirstNextLastCalc(subCalcFNL, io);
}
