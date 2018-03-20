
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import mostRecentHygieneAllAccounts from '../lib/lastHygiene';
import mostRecentRecallAllAccounts from '../lib/lastRecall';
import mostRecentDueDateAllAccounts from '../lib/dueDate';
import mostRecentRestorativeAllAccounts from '../lib/lastRestorative';

global.io = createSocketServer();

jobQueue.process('patientCache', async (job, done) => {
  try {
    await mostRecentRestorativeAllAccounts();
    await mostRecentHygieneAllAccounts();
    await mostRecentRecallAllAccounts();
    await mostRecentDueDateAllAccounts();
    done();
  } catch (err) {
    done(err);
  }
});