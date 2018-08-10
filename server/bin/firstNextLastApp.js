
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import { Appointment, Patient, Account } from '../_models';

const { calcFirstNextLastAppointment } = require('../lib/firstNextLastAppointment');

global.io = createSocketServer();

// We could use Heroku Scheduler for this but I have never tested it - JS
jobQueue.process('firstNextLastApp', async (job, done) => {
  try {
    const { data: { date } } = job;

    const accounts = await Account.findAll({
      raw: true,
    });

    for (let i = 0; i < accounts.length; i += 1) {
      let totalPatients = await Patient.count({
        where: {
          accountId: accounts[i].id,
        },
      });

      const limit = 1000;
      let offset = 0;

      while (totalPatients > 0) {
        const patients = await Patient.findAll({
          where: {
            accountId: accounts[i].id,
            status: 'Active',
          },
          attributes: ['id'],
          raw: true,
          limit,
          offset,
          order: [['createdAt', 'DESC']],
        });

        const appointments = await Appointment.findAll({
          where: {
            accountId: accounts[i].id,
            isCancelled: false,
            isMissed: false,
            isPending: false,
            isDeleted: false,
            patientId: {
              $in: getIds(patients, 'id'),
            },
          },
          attributes: ['id', 'startDate', 'patientId'],
          raw: true,
          order: [['patientId', 'DESC'], ['startDate', 'DESC']],
        });

        await calcFirstNextLastAppointment(appointments,
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

        totalPatients -= limit;
        offset += limit;
      }
      console.log(`Updated patients first next last appointment information for ${accounts[i].name}.`);
    }

    done();
  } catch (err) {
    done(err);
  }
});

function getIds(patients, key) {
  return patients.map((patient) => {
    return patient[key];
  });
}
