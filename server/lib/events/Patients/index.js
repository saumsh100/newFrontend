
import moment from 'moment';
import { Patient, Appointment } from '../../../_models';
import CalcFirstNextLastAppointment from '../../../lib/firstNextLastAppointment';


function getFirstNextLastAppointment(app) {
  return Appointment.findAll({
    raw: true,
    where: {
      accountId: app.accountId,
      patientId: app.patientId,
      isCancelled: false,
      isDeleted: false,
      isPending: false,
    },
    order: [['startDate', 'DESC']],
  }).then((appointments) => {
    return CalcFirstNextLastAppointment(appointments,
      async (currentPatient, firstApptId, nextApptId, lastApptId) => {
        try {
          await Patient.update({
            firstApptId,
            nextApptId,
            lastApptId,
          },
            {
              where: {
                id: currentPatient,
              },
            });
        } catch (err) {
          console.log(err);
        }
      });
  });
};

function optimizedFirstNextLastSetter(app, patient, startDate) {
  if (moment(startDate).isAfter(new Date()) && !patient.nextApptId) {

    patient.nextApptId = app.id;

    return Patient.update(patient, {
      where: {
        id: patient.id,
      },
    });

  } else if (moment(startDate).isAfter(new Date()) && patient.nextApptId) {

    return Appointment.findOne({
      where: { id: patient.nextApptId },
      raw: true,
    }).then((appNext) => {
      if (moment(appNext.startDate).isAfter(moment(startDate))) {
        patient.nextApptId = app.id;

        return Patient.update(patient, {
          where: {
            id: patient.id,
          },
        });
      }
    });

  } else if (moment(startDate).isBefore(new Date())
    && !patient.lastApptId && !patient.firstApptId) {

    patient.lastApptId = app.id;
    patient.firstApptId = app.id;

    return Patient.update(patient, {
      where: {
        id: patient.id,
      },
    });

  } else {
    return getFirstNextLastAppointment(app);
  }
}

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
      const patient = app.patient;
      const startDate = app.startDate;

      if (!app.isDeleted && !app.isPending && !app.isCancelled) {
        return optimizedFirstNextLastSetter(app, patient, startDate);
      }

      return getFirstNextLastAppointment(app);
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
