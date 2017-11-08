
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
      async (currentPatient, appointmentsObj) => {
        try {
          await Patient.update({
            ...appointmentsObj,
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

function firstNextLastSetter(app, patient, startDate) {
  if (moment(startDate).isAfter(new Date()) && !patient.nextApptId) {

    patient.nextApptId = app.id;
    patient.nextApptDate = startDate;

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
        patient.nextApptDate = startDate;

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
    patient.lastApptDate = startDate;

    patient.firstApptId = app.id;
    patient.firstApptDate = startDate;

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
      if (app) {
        const patient = app.patient;
        const startDate = app.startDate;

        if (!app.isDeleted && !app.isPending && !app.isCancelled) {
          return firstNextLastSetter(app, patient, startDate);
        }

        return getFirstNextLastAppointment(app);
      }
    });
  });
}

function registerFirstNextLastBatchCalc(sub, io) {
  sub.on('data', (data) => {
    const appointmentIds = JSON.parse(data);
    return Appointment.findAll({
      raw: true,
      where: {
        id: appointmentIds,
        isCancelled: false,
        isDeleted: false,
        isPending: false,
        patientId: {
          $not: null,
        },
      },
      order: [['patientId', 'DESC'], ['startDate', 'DESC']],
    }).then((appointments) => {
      console.log('Batching First Next Last');
      return CalcFirstNextLastAppointment(appointments,
        async (currentPatient, appointmentsObj) => {
          try {
            await Patient.update({
              ...appointmentsObj,
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
  });
}

export default function registerAppointmentsSubscriber(context, io) {
  // Need to create a new sub for every route to tell
  // the difference eg. request.created and request.ended
  const subCalcFirstNextLast = context.socket('SUB', { routing: 'topic' });
  const subCalcFirstNextLastBatch = context.socket('SUB', { routing: 'topic' });

  subCalcFirstNextLast.setEncoding('utf8');
  subCalcFirstNextLast.connect('events', 'APPOINTMENT:CREATED');
  subCalcFirstNextLast.connect('events', 'APPOINTMENT:UPDATED');
  subCalcFirstNextLast.connect('events', 'APPOINTMENT:DELETED');

  subCalcFirstNextLastBatch.setEncoding('utf8');
  subCalcFirstNextLastBatch.connect('events', 'APPOINTMENT:CREATED:BATCH');
  subCalcFirstNextLastBatch.connect('events', 'APPOINTMENT:UPDATED:BATCH');
  subCalcFirstNextLastBatch.connect('events', 'APPOINTMENT:DELETED:BATCH');

  registerFirstNextLastCalc(subCalcFirstNextLast, io);
  registerFirstNextLastBatchCalc(subCalcFirstNextLastBatch, io);
}
