
import { Account, SentReminder } from '../../models';
import { getAppointmentsFromReminder } from './helpers';
import sendReminder from './sendReminder';

/**
 *
 * @param account
 * @returns {Promise.<void>}
 */
export async function sendRemindersForAccount(account, date) {
  const { reminders } = account;
  console.log('Account.id=', account.id);
  console.log(reminders.length, 'reminder alerts set up');
  for (const reminder of reminders) {
    // Get appointments that this reminder deals with
    console.log('reminders.lengthSeconds', reminder.lengthSeconds);
    const appointments = await getAppointmentsFromReminder({ reminder, account, date });
    console.log(`${appointments.length} appointments to send reminders to`);
    for (const appointment of appointments) {
      const { patient } = appointment;
      const { primaryType } = reminder;
      console.log(`Sending ${primaryType} reminder for appointment w/ note: ${appointment.note}`);
      await sendReminder[primaryType]({
        patient,
        account,
        appointment,
      }).then((data) => {
        console.log(`Sent ${primaryType} reminder to ${patient.firstName}`);
        // console.log('data', data);
        // We might want to wait on this to ensure it is written into DB before next
        // pull of appointments
        return SentReminder.save({
          reminderId: reminder.id,
          accountId: account.id,
          appointmentId: appointment.id,
          lengthSeconds: reminder.lengthSeconds,
        }).then((sr) => {
          console.log('SentReminder saved', sr.id);
        });
      }).catch((err) => {
        console.error(`Failed to send ${primaryType} reminder to ${patient.firstName}`);
        console.error(err);
      });
    }
  }
}

/**
 *
 * @returns {Promise.<Array|*>}
 */
export async function computeRemindersAndSend({ date }) {
  // - Fetch Reminders in order of shortest secondsAway
  // - For each reminder, fetch the appointments that fall in this range
  // that do NOT have a reminder sent (type of reminder?)
  // - For each appointment, send the reminder
  const joinObject = {
    reminders: {
      _apply(sequence) {
        return sequence.orderBy('lengthSeconds');
      },
    },
  };

  // Get all clinics that actually want reminders sent and get their Reminder Preferences
  const accounts = await Account.filter({ canSendReminders: true }).getJoin(joinObject).run();
  for (const account of accounts) {
    await sendRemindersForAccount(account, date);
  }
}
