
import { Account, Chat, SentReminder, TextMessage } from '../../models';
import normalize from '../../routes/api/normalize';
import { sanitizeTwilioSmsData } from '../../routes/twilio/util';
import { getAppointmentsFromReminder } from './helpers';
import sendReminder from './sendReminder';

function sendSocket(io, chatId) {
  const joinObject = { patient: true };
  joinObject.textMessages = {
    _apply: (sequence) => {
      return sequence
        .orderBy('createdAt');
    },
  };

  return Chat.get(chatId).getJoin(joinObject).run()
    .then((chat) => {
      io.of('/dash')
        .in(chat.patient.accountId)
        .emit('newMessage', normalize('chat', chat));
    });
}

/**
 *
 * @param account
 * @returns {Promise.<void>}
 */
export async function sendRemindersForAccount(account, date) {
  const { reminders } = account;
  for (const reminder of reminders) {
    // Get appointments that this reminder deals with
    const appointments = await getAppointmentsFromReminder({ reminder, account, date });
    for (const appointment of appointments) {
      const { patient } = appointment;
      const { primaryType } = reminder;

      // Save sent reminder first so we can
      // - use sentReminderId as token in email
      // - keep track of failed reminders
      const sentReminder = await SentReminder.save({
        reminderId: reminder.id,
        accountId: account.id,
        patientId: patient.id,
        appointmentId: appointment.id,
        lengthSeconds: reminder.lengthSeconds,
        primaryType: reminder.primaryType,
      });

      const data = await sendReminder[primaryType]({
        patient,
        account,
        appointment,
        sentReminder,
      });

      console.log(`${primaryType} reminder sent to ${patient.firstName} ${patient.lastName} for ${account.name}`);
      await sentReminder.merge({ isSent: true }).save();

      if (primaryType === 'sms') {
        const textMessageData = sanitizeTwilioSmsData(data);
        const { to } = textMessageData;
        const chats = await Chat.filter({ accountId: account.id, patientPhoneNumber: to });
        let chat = chats[0];
        if (!chat) {
          chat = await Chat.save({
            accountId: account.id,
            patientId: patient.id,
            patientPhoneNumber: to,
          });
        }

        // Now save TM
        const textMessage = await TextMessage.save(Object.assign({}, textMessageData, { chatId: chat.id, read: true }));

        // Update Chat to have new textMessage
        await chat.merge({ lastTextMessageId: textMessage.id, lastTextMessageDate: textMessage.createdAt }).save();

        await sendSocket(global.io, chat.id);
      }
    }
  }
}

/**
 *
 * @returns {Promise.<Array|*>}
 */
export async function computeRemindersAndSend({ date }) {
  // - Fetch RemindersList in order of shortest secondsAway
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
