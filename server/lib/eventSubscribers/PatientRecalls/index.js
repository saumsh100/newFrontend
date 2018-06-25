
import { Account, PatientRecall } from '../../../_models';
import { getConfigsForDueDates, updatePatientDueDatesForAccount } from '../../../lib/dueDate';

 /**
 * does the due date calculation when a patientRecalls(s)
 * is changed and the other jobs it needs (last recall and last hygiene)
 *
 * @param  {[uuid]} patientRecallIds - array of patientRecall ids that got updated
 */
async function dueDateCalculation(patientRecallIds) {
  const patientRecalls = await PatientRecall.findAll({
    raw: true,
    group: ['patientId', 'accountId'],
    paranoid: false,
    attributes: ['patientId', 'accountId'],
    where: {
      id: patientRecallIds,
      patientId: {
        $not: null,
      },
    },
  });

  if (patientRecalls.length) {
    const patientIds = patientRecalls.map(p => p.patientId);
    const accountId = patientRecalls[0].accountId;

    // Fetch account and other configurations that are important for the dueDates job
    const account = await Account.findById(accountId);
    const configurationsMap = await getConfigsForDueDates(account);
    const date = (new Date()).toISOString();
    await updatePatientDueDatesForAccount({ account, date, patientIds, ...configurationsMap });
  }
}

export default function registerPatientRecallSubscriber(context) {
  // It is only ever udpated in batch so no need for other event hooks here
  const batchWorker = context.socket('WORKER', { prefetch: 3 });
  batchWorker.connect('PATIENTRECALL:BATCH');
  batchWorker.setEncoding('utf8');
  batchWorker.on('data', async (data) => {
    const patientRecallIds = JSON.parse(data);
    await dueDateCalculation(patientRecallIds);
    return batchWorker.ack();
  });

  const pushBatch = context.socket('PUSH');
  pushBatch.connect('PATIENTRECALL:BATCH');

  const subCreated = context.socket('SUB', { routing: 'topic' });
  subCreated.setEncoding('utf8');
  subCreated.connect('events', 'PATIENTRECALL:CREATED:BATCH');
  subCreated.connect('events', 'PATIENTRECALL:UPDATED:BATCH');

  subCreated.on('data', async (data) => {
    return pushBatch.write(data, 'utf8');
  });
}
