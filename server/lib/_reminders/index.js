
import { Account, Chat, Patient, Reminder, SentReminder, TextMessage } from '../../_models';
import normalize from '../../routes/api/normalize';
import { sanitizeTwilioSmsData } from '../../routes/twilio/util';
import { getAppointmentsFromReminder } from './helpers';
import sendReminder from './sendReminder';

async function sendSocket(io, chatId) {
  let chat = await Chat.findOne({
    where: { id: chatId },
    include: [
      {
        model: TextMessage,
        as: 'textMessages',
        order: ['createdAt', 'DESC'],
      },
      {
        model: Patient,
        as: 'patient',
      },
    ],
  });

  chat = chat.get({ plain: true });

  await io.of('/dash')
    .in(chat.patient.accountId)
    .emit('newMessage', normalize('chat', chat));
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
      const sentReminder = await SentReminder.create({
        reminderId: reminder.id,
        accountId: account.id,
        patientId: patient.id,
        appointmentId: appointment.id,
        lengthSeconds: reminder.lengthSeconds,
        primaryType: reminder.primaryType,
      });

      let data = null;

      try {
        data = await sendReminder[primaryType]({
          patient,
          account,
          appointment,
          sentReminder,
        });
      } catch (error) {
        console.log(error)
        continue;
      }

      console.log(`${primaryType} reminder sent to ${patient.firstName} ${patient.lastName} for ${account.name}`);
      await sentReminder.update({ isSent: true });
      await appointment.update({ isReminderSent: true });

      if (primaryType === 'sms') {
        const textMessageData = sanitizeTwilioSmsData(data);
        const { to } = textMessageData;
        let chat = await Chat.findOne({ where: { accountId: account.id, patientPhoneNumber: to } });
        if (!chat) {
          chat = await Chat.create({
            accountId: account.id,
            patientId: patient.id,
            patientPhoneNumber: to,
          });
        }

        // Now save TM
        const textMessage = await TextMessage.create(Object.assign({}, textMessageData, { chatId: chat.id, read: true }));

        // Update Chat to have new textMessage
        await chat.update({ lastTextMessageId: textMessage.id, lastTextMessageDate: textMessage.createdAt });

        // // Now update the clients in real-time
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
  /*const joinObject = {
    reminders: {
      _apply(sequence) {
        return sequence.orderBy('lengthSeconds');
      },
    },
  };*/

  // Get all clinics that actually want reminders sent and get their Reminder Preferences
  // const accounts = await Account.filter({ canSendReminders: true }).getJoin(joinObject).run();

  const accounts = await Account.findAll({
    where: {
      canSendReminders: true,
    },

    include: [{
      model: Reminder,
      as: 'reminders',
      order: ['lengthSeconds', 'DESC'],
    }],
  });

  for (const account of accounts) {
    await sendRemindersForAccount(account.get({ plain: true }), date);
  }
}
