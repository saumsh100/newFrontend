
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import { Appointment, Patient } from '../_models';

const CalcFirstNextLastAppointment = require('../lib/firstNextLastAppointment');

global.io = createSocketServer();

// We could use Heroku Scheduler for this but I have never tested it - JS
jobQueue.process('firstNextLastApp', async (job, done) => {
  try {
    const { data: { date } } = job;

    const appointments = await Appointment.findAll({
      where: {
        isCancelled: false,
        isPending: false,
        isDeleted: false,
        patientId: {
          $not: null,
        },
      },
      order: [['patientId', 'DESC'], ['startDate', 'DESC']],
    });

    CalcFirstNextLastAppointment(appointments,
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
          done(err);
        }
      });
    done();
  } catch (err) {
    done(err);
  }
});
