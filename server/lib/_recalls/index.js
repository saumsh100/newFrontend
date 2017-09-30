
import { Account, Patient, SentRecall, Recall } from '../../_models';
import { getPatientsDueForRecall } from './helpers';
import normalize from '../../routes/api/normalize';
import sendRecall from './sendRecall';
import app from '../../bin/app';
import { namespaces } from '../../config/globals';

async function sendSocketRecall(io, sentRecallId) {
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
}
/**
 *
 * @param account
 * @returns {Promise.<void>}
 */
export async function sendRecallsForAccount(account, date) {
  const { recalls } = account;
  for (const recall of recalls) {
    // Get patients whose last appointment is associated with this recall
    const patients = await getPatientsDueForRecall({ recall, account, date });
    for (const patient of patients) {
      // Check if latest appointment is within the recall window
      const { primaryType } = recall;
      const { appointments } = patient;
      const lastAppointment = appointments[appointments.length - 1];
      const sentRecall = await SentRecall.create({
        recallId: recall.id,
        accountId: account.id,
        patientId: patient.id,
        lengthSeconds: recall.lengthSeconds,
        primaryType: recall.primaryType,
      });

      let data;

      try {
        data = await sendRecall[primaryType]({
          patient,
          account,
          lastAppointment,
        });
      } catch (error) {

      }

      console.log(`${primaryType} recall sent to ${patient.firstName} ${patient.lastName} for ${account.name}`);
      await sentRecall.update({ isSent: true });
      await sendSocketRecall(global.io, sentRecall.id);
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

    include: [{
      model: Recall,
      as: 'recalls',
      order: ['lengthSeconds', 'DESC'],
    }],
  });

  for (const account of accounts) {
    await sendRecallsForAccount(account.get({ plain: true }), date);
  }
}
