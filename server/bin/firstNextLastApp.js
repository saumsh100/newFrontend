
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import { Appointment, Patient, Account } from '../_models';

const { calcFirstNextLastAppointment } = require('../lib/firstNextLastAppointment');

global.io = createSocketServer();

// We could use Heroku Scheduler for this but I have never tested it - JS
jobQueue.process('firstNextLastApp', async (job, done) => {
  try {
    const { data: { date } } = job;

    const accounts = await Account.findAll({ attributes: ['id', 'name'] });

    for (let i = 0; i < accounts.length; i += 1) {
      let totalPatients = await Patient.count({ where: { accountId: accounts[i].id } });

      const limit = 1000;
      let offset = 0;

      while (totalPatients > 0) {
        const patients = await Patient.findAll({
          where: { accountId: accounts[i].id },
          attributes: ['id', 'lastApptId', 'firstApptId', 'nextApptId'],
          limit,
          offset,
          order: [['createdAt', 'DESC']],
        });

        const appointments = await Appointment.findAll({
          where: {
            accountId: accounts[i].id,
            isPending: false,
            patientId: { $in: getIds(patients, 'id') },
          },
          attributes: ['id', 'startDate', 'patientId', 'deletedAt', 'isCancelled', 'isDeleted', 'isMissed'],
          order: [['patientId', 'DESC'], ['startDate', 'DESC']],
          paranoid: false,
        });

        await calcFirstNextLastAppointment(
          appointments,
          updatePatientCallback(patients),
        );
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

const updatePatientCallback = patients => async (currentPatient, appointmentsObj) => {
  try {
    const {
      lastApptId,
      nextApptId,
      firstApptId,
    } = appointmentsObj;

    const comparePatient = patients.find(p => p.id === currentPatient);

    if (comparePatient.lastApptId !== lastApptId
      || comparePatient.nextApptId !== nextApptId
      || comparePatient.firstApptId !== firstApptId) {
      await Patient.update(
        { ...appointmentsObj },
        { where: { id: currentPatient } },
      );
    }
  } catch (err) {
    console.log(err);
  }
};

const getIds = (patients, key) => patients.map(patient => patient[key]);
