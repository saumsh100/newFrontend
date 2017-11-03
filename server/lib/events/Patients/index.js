
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

function registerFirstNextLastCalc(sub, io) {
  sub.on('data', (data) => {
    Appointment.findOne({
      where: { id: data },
      raw: true,
    }).then((app) => {
      getFirstNextLastAppointment(app);
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
