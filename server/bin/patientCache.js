
import { Account } from 'CareCruModels';
import jobQueue from '../config/jobQueue';
import createSocketServer from '../sockets/createSocketServer';
import runLastProcedureCronForAccounts from '../lib/lastProcedure/runLastProcedureCronForAccounts';
import lastProcedureData from '../lib/lastProcedure/lastProcedureData';
import mostRecentDueDateAllAccounts from '../lib/dueDate';

global.io = createSocketServer();

jobQueue.process('patientCache', async (job, done) => {
  try {
    const { data: { date } } = job;

    // No need for lastProcedure jobs to re-fetch everytime
    const accounts = await Account.findAll({});
    await runLastProcedureCronForAccounts({ accounts, ...lastProcedureData['lastHygiene'] });
    await runLastProcedureCronForAccounts({ accounts, ...lastProcedureData['lastRecall'] });
    await runLastProcedureCronForAccounts({ accounts, ...lastProcedureData['lastRestorative'] });
    await mostRecentDueDateAllAccounts({ date });
    done();
  } catch (err) {
    done(err);
  }
});
