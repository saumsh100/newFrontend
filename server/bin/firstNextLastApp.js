
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import { Appointment, Patient, Account, } from '../_models';

const CalcFirstNextLastAppointment = require('../lib/firstNextLastAppointment');

global.io = createSocketServer();

// We could use Heroku Scheduler for this but I have never tested it - JS
jobQueue.process('firstNextLastApp', async (job, done) => {
  try {
    const { data: { date } } = job;

    const accounts = await Account.findAll({
      raw: true,
    });

    for (let i = 0; i < accounts.length; i += 1) {
      const appointments = await Appointment.findAll({
        where: {
          accountId: accounts[i].id,
          isCancelled: false,
          isPending: false,
          isDeleted: false,
          patientId: {
            $not: null,
          },
        },
        attributes: ['id', 'startDate', 'patientId'],
        raw: true,
        order: [['patientId', 'DESC'], ['startDate', 'DESC']],
      });

      CalcFirstNextLastAppointment(appointments,
        async (currentPatient, appointmentsObj) => {
          try {
            await Patient.update({ ...appointmentsObj },
              {
                where: {
                  id: currentPatient,
                },
              });
          } catch (err) {
            console.log(err);
          }
        });

      console.log(`Updated patients first next last appointment information for ${accounts[i].name}.`);
    }

    done();
  } catch (err) {
    done(err);
  }
});
