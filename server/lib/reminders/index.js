
import { env } from '../../config/globals';
import {
  Account,
  Appointment,
  Chat,
  Patient,
  Reminder,
  SentReminder,
  TextMessage,
} from '../../_models';
import normalize from '../../routes/api/normalize';
import { sanitizeTwilioSmsData } from '../../routes/twilio/util';
import { generateOrganizedPatients } from '../comms/util';
import { mapPatientsToReminders } from './helpers';
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


/*function sendSocketReminder(io, sentReminderId) {
  return SentReminder.findOne({
    where: {
      id: sentReminderId,
    },
    include: [
      {
        model: Appointment,
        as: 'appointment',
      },
      {
        model: Reminder,
        as: 'reminder',
      },
      {
        model: Patient,
        as: 'patient',
      },
    ],
  }).then((sentReminderOne) => {
    const sentReminder = sentReminderOne.get({ plain: true });
    io.of('/dash')
      .in(sentReminder.accountId)
      .emit('create:SentReminder', normalize('sentReminder', sentReminder));
  });
}*/

/**
 *
 * @param account
 * @returns {Promise.<void>}
 */
export async function sendRemindersForAccount(account, date) {
  console.log(`Sending reminders for ${account.name}`);
  const { reminders, name } = account;

  const remindersPatients = await mapPatientsToReminders({ reminders, account, date });

  let i;
  for (i = 0; i < reminders.length; i++) {
    const reminder = reminders[i];
    const { errors, success } = remindersPatients[i];

    const { primaryType, lengthSeconds } = reminder;

    try {
      console.log(`Trying to bulkSave ${errors.length} ${primaryType}_${lengthSeconds} failed sentReminders for ${name}`);

      // Save failed sentRecalls from errors
      const failedSentReminders = errors.map(({ errorCode, patient }) => ({
        reminderId: reminder.id,
        accountId: account.id,
        patientId: patient.id,
        appointmentId: patient.appointment.id,
        lengthSeconds: reminder.lengthSeconds,
        primaryType,
        errorCode,
      }));

      await SentReminder.bulkCreate(failedSentReminders);
      console.log(`${errors.length} ${primaryType}_${lengthSeconds} failed sentReminders saved!`);
    } catch (err) {
      console.error(`FAILED bulkSave of failed sentReminders`, err);
      // TODO: do we want to throw the error hear and ignore trying to send?
    }

    console.log(`Trying to send ${success.length} ${primaryType}_${lengthSeconds} reminders for ${name}`);
    for (const patient of success) {
      const { appointment } = patient;
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
        console.log(`${primaryType}_${lengthSeconds} reminder not sent to ${patient.firstName} ${patient.lastName} for ${account.name}`);
        console.log(error);
        continue;
      }

      console.log(`${primaryType}_${lengthSeconds} reminder sent to ${patient.firstName} ${patient.lastName} for ${account.name}`);
      await sentReminder.update({ isSent: true });
      await appointment.update({ isReminderSent: true });
      // await sendSocketReminder(global.io, sentReminder.id);

      // TODO: need to refactor to go through a Chat module so its unified across API and other services
      if (primaryType === 'sms' && env !== 'test') {
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
  // Get all clinics that actually want reminders sent and get their Reminder Preferences
  // const accounts = await Account.filter({ canSendReminders: true }).getJoin(joinObject).run();
  const accounts = await Account.findAll({
    where: {
      canSendReminders: true,
    },

    order: [[{ model: Reminder, as: 'reminders' }, 'lengthSeconds', 'asc']],

    include: [{
      model: Reminder,
      as: 'reminders',
    }],
  });

  for (const account of accounts) {
    // use `exports.` because we can mock it and stub it in test suite
    await exports.sendRemindersForAccount(account.get({ plain: true }), date);
  }
}
