
import { Account, Patient, SentRecall } from '../../models';
import { getPatientsDueForRecall } from './helpers';
import sendRecall from './sendRecall';

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
      const sentRecall = await SentRecall.save({
        recallId: recall.id,
        accountId: account.id,
        patientId: patient.id,
        lengthSeconds: recall.lengthSeconds,
        primaryType: recall.primaryType,
      });

      const data = await sendRecall[primaryType]({
        patient,
        account,
        lastAppointment,
      });

      console.log(`${primaryType} recall sent to ${patient.firstName} ${patient.lastName} for ${account.name}`);
      await sentRecall.merge({ isSent: true }).save();
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
  const joinObject = {
    recalls: {
      _apply(sequence) {
        return sequence.orderBy('lengthSeconds');
      },
    },
  };

  // Get all clinics that actually want reminders sent and get their Reminder Preferences
  const accounts = await Account.filter({ canSendRecalls: true }).getJoin(joinObject).run();
  for (const account of accounts) {
    await sendRecallsForAccount(account, date);
  }
}
