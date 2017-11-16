
import { Account, Patient, SentRecall, Recall } from '../../_models';
import {
  getPatientsDueForRecall,
  mapPatientsToRecalls,
} from './helpers';
import { generateOrganizedPatients } from '../comms/util';
import normalize from '../../routes/api/normalize';
import sendRecall from './sendRecall';
import app from '../../bin/app';
import { namespaces } from '../../config/globals';


/*async function sendSocketRecall(io, sentRecallId) {
  let sentRecall = await SentRecall.findOne({
    where: { id: sentRecallId },
    include: [
      {
        model: Recall,
        as: 'recall',
      },
      {
        model: Patient,
        as: 'patient',
      },
    ],
  });

  sentRecall = sentRecall.get({ plain: true });

  return io.of('/dash')
          .in(sentRecall.patient.accountId)
          .emit('create:SentRecall', normalize('sentRecall', sentRecall));
}*/
/**
 * sendRecallsForAccount
 *
 * @param account
 * @param date
 * @returns {Promise.<void>}
 */
export async function sendRecallsForAccount(account, date, pubSocket) {
  console.log(`Sending recalls for ${account.name}`);
  const { recalls, name } = account;

  const recallsPatients = await mapPatientsToRecalls({ recalls, account, date });

  // Grab all failures and do a bulkCreate to reduce load
  /*let totalFailures = [];
  recallsPatients.forEach((rp, i) => {
    totalFailures = totalFailures.concat(rp.errors.map(({ errorCode, patient }) => ({
      recallId: recalls[i].id,
      accountId: account.id,
      patientId: patient.id,
      lengthSeconds: recalls[i].lengthSeconds,
      primaryType: recalls[i].primaryType,
      errorCode,
    })));
  });*/

  let i;
  for (i = 0; i < recalls.length; i++) {
    const recall = recalls[i];
    const { errors, success } = recallsPatients[i];
    const { primaryType, lengthSeconds } = recall;

    try {
      console.log(`Trying to bulkSave ${errors.length} ${primaryType}_${lengthSeconds} failed sentRecalls for ${name}...`);

      // Save failed sentRecalls from errors
      const failedSentRecalls = errors.map(({ errorCode, patient }) => ({
        recallId: recall.id,
        accountId: account.id,
        patientId: patient.id,
        lengthSeconds: recall.lengthSeconds,
        primaryType,
        errorCode,
      }));

      await SentRecall.bulkCreate(failedSentRecalls);
      console.log(`${errors.length} ${primaryType}_${lengthSeconds} failed sentRecalls saved!`);
    } catch (err) {
      console.error(`FAILED bulkSave of failed sentRecalls`, err);
      // TODO: do we want to throw the error hear and ignore trying to send?
    }

    // Save ids of recalls sent as we are sending them
    const sentRecallsIds = [];

    console.log(`Trying to send ${success.length} ${primaryType}_${lengthSeconds} recalls for ${name}`);
    for (const patient of success) {
      // Check if latest appointment is within the recall window
      const { appointments } = patient;
      const lastAppointment = appointments[appointments.length - 1];
      const sentRecall = await SentRecall.create({
        recallId: recall.id,
        accountId: account.id,
        patientId: patient.id,
        lengthSeconds: recall.lengthSeconds,
        primaryType,
      });

      try {
        await sendRecall[primaryType]({
          patient,
          account,
          lastAppointment,
        });
      } catch (error) {
        console.log(`${primaryType} recall NOT SENT to ${patient.firstName} ${patient.lastName} for ${name} because:`);
        console.error(err);
        continue;
      }

      console.log(`${primaryType} recall SENT to ${patient.firstName} ${patient.lastName} for ${account.name}!`);
      await sentRecall.update({ isSent: true });

      sentRecallsIds.push(sentRecall.id);

      // TODO: need Chat update for SMS recalls
      // TODO: Update all successfully sent Recalls
      // await sendSocketRecall(global.io, sentRecall.id);
    }

    if (sentRecallsIds.length) {
      await pubSocket.publish('RECALL:SENT:BATCH', JSON.stringify(sentRecallsIds));
    }
  }
}

/**
 *
 * @returns {Promise.<Array|*>}
 */
export async function computeRecallsAndSend({ date, publishSocket }) {
  // - Fetch Reminders in order of shortest secondsAway
  // - For each reminder, fetch the appointments that fall in this range
  // that do NOT have a reminder sent (type of reminder?)
  // - For each appointment, send the reminder
  // Get all clinics that actually want reminders sent and get their Reminder Preferences
  const accounts = await Account.findAll({
    where: {
      canSendRecalls: true,
    },

    order: [[{ model: Recall, as: 'recalls' }, 'lengthSeconds', 'asc']],

    include: [{
      model: Recall,
      as: 'recalls',
    }],
  });

  for (const account of accounts) {
    // use `exports.` because we can mock it and stub it in test suite
    await exports.sendRecallsForAccount(account.get({ plain: true }), date, publishSocket);
  }
}
