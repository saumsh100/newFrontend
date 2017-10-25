
import { Account, Patient, SentRecall, Recall } from '../../_models';
import { getPatientsDueForRecall, organizePatients } from './helpers';
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
 *
 * @param account
 * @param date
 * @returns {Promise.<void>}
 */
export async function sendRecallsForAccount(account, date) {
  const { recalls, name } = account;
  for (const recall of recalls) {
    const { primaryType } = recall;

    // TODO: we have a function that returns patients per recall { [recall1.id]: [patientsArray] }
    // Get patients whose last appointment is associated with this recall
    const patients = await getPatientsDueForRecall({ recall, account, date });
    const { success, errors } = generateOrganizedPatients(patients, primaryType);

    try {
      console.log(`Trying to bulkSave ${errors.length} ${primaryType} failed sentRecalls for ${name}`);

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
    } catch (err) {
      console.error(`FAILED bulkSave of failed sentRecalls`, err);
      // TODO: do we want to throw the error hear and ignore trying to send?
    }

    console.log(`Trying to send ${success.length} ${primaryType} recalls for ${name}`);
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

      // TODO: this is only needed for sms recalls
      // TODO: perhaps we update all successfully sent Recalls


      // await sendSocketRecall(global.io, sentRecall.id);
    }
  }
}

/**
 *
 * @returns {Promise.<Array|*>}
 */
export async function computeRecallsAndSend({ date }) {
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
    await exports.sendRecallsForAccount(account.get({ plain: true }), date);
  }
}
