
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
      console.log(patient)

     if (!app.isDeleted && !app.isPending && !app.isCancelled) {

       if (moment(startDate).isAfter(new Date()) && !patient.nextApptId ) {

         patient.nextApptId = app.id;
         console.log('patient--->', patient)

         return Patient.update(patient, {
           where: {
             id: patient.id,
           },
         });

       } else if (moment(startDate).isAfter(new Date()) && patient.nextApptId) {

         Appointment.findOne({
           where: { id: patient.nextApptId },
           raw: true,
         }).then((appNext) => {
            if (moment(appNext.startDate).isAfter(moment(startDate))) {
              patient.nextApptId = app.id;
              console.log('patient--->', patient)

              return Patient.update(patient, {
                where: {
                  id: patient.id,
                },
              });
            }
         });

       } else if (moment(startDate).isBefore(new Date()) && !patient.lastApptId && !patient.firstApptId) {
         patient.lastApptId = app.id;
         patient.firstApptId = app.id;

         return Patient.update(patient, {
           where: {
             id: patient.id,
           },
         });
       } else if (moment(startDate).isBefore(new Date()) && patient.lastApptId && patient.firstApptId) {

         Appointment.findOne({
           where: { id: patient.lastApptId },
           raw: true,
         }).then((appLast) => {
           if (moment(appLast.startDate).isBefore(moment(startDate))) {
             patient.lastApptId = app.id;

             return Patient.update(patient, {
               where: {
                 id: patient.id,
               },
             });
           }
         });

       } else {
         return getFirstNextLastAppointment(app);
       }
     } else {
       return getFirstNextLastAppointment(app);
     }
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
