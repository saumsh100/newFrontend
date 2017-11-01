
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
    if (appointments.length === 1) {

      if (moment(appointments[0].startDate).isBefore(new Date())) {
        patient.firstApptId = appointments[0].id;
        patient.lastApptId = appointments[0].id;
        patient.nextApptId = null;
      } else if (moment(appointments[0].startDate).isAfter(new Date())) {
        patient.nextApptId = appointments[0].id;
        patient.lastApptId = null;
        patient.firstApptId = null;
      }

    } else if (appointments.length > 1) {
      const today = new Date();

      let nextAppt = null;
      let nextApptId = null;

      for (let i = 0; i < appointments.length; i += 1) {
        const app = appointments[i];
        const startDate = app.startDate;

        if (!nextAppt && moment(startDate).isAfter(today)) {
          nextAppt = startDate;
          nextApptId = app.id;
        } else if (moment(startDate).isAfter(today) && moment(startDate).isBefore(nextAppt)) {
          nextAppt = startDate;
          nextApptId = app.id;
          break;
        }
      }

      let lastAppt = null;
      let lastApptId = null;

      for (let j = 0; j < appointments.length; j += 1) {
        const app = appointments[j];
        const startDate = app.startDate;

        if (!lastAppt && moment(startDate).isBefore(moment())) {
          lastAppt = startDate;
          lastApptId = app.id;
          break;
        }
      }

      patient.nextApptId = nextApptId;
      patient.lastApptId = lastApptId;

      const endAppointment = appointments[appointments.length - 1];

      if (moment(endAppointment.startDate).isBefore(today)) {
        patient.firstApptId = endAppointment.id;
      } else {
        patient.firstApptId = null;
      }

    } else {
      patient.nextApptId = null;
      patient.lastApptId = null;
      patient.firstApptId = null;
    }
    console.log(patient)
    Patient.update(patient, {
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
