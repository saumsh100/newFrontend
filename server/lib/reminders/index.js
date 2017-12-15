
import moment from 'moment';
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
import { sortIntervalAscPredicate } from '../../util/time';
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

function getIsConfirmable(appointment) {
  return !appointment.isPatientConfirmed;
}

/**
 *
 * @param account
 * @returns {Promise.<void>}
 */
export async function sendRemindersForAccount(account, date, pub) {
  const { reminders, name } = account;
  console.log(`Sending reminders for ${name} (${account.id}) at ${moment(date).format('YYYY-MM-DD h:mma')}...`);

  // Sort reminders by interval so that we send to earliest first
  const sortedReminders = reminders.sort((a, b) => sortIntervalAscPredicate(a.interval, b.interval));

  const sentReminderIds = [];
  const remindersPatients = await mapPatientsToReminders({ reminders: sortedReminders, account, startDate: date });

  let i;
  for (i = 0; i < sortedReminders.length; i++) {
    const reminder = sortedReminders[i];
    const { errors, success } = remindersPatients[i];
    const { primaryTypes, interval } = reminder;

    // For logging purposes
    const reminderName = `'${interval} ${primaryTypes.join(' & ')}'`;

    console.log(`-- Sending ${reminderName} reminder...`);
    console.log(`---- ${errors.length} => sentReminders that would fail`);

    if (errors.length) {
      try {
        // Save failed sentRecalls from errors
        const failedSentReminders = errors.map(({errorCode, patient, primaryType}) => ({
          reminderId: reminder.id,
          accountId: account.id,
          patientId: patient.id,
          appointmentId: patient.appointment.id,
          isConfirmable: getIsConfirmable(patient.appointment),
          interval: reminder.interval,
          primaryType,
          errorCode,
        }));

        await SentReminder.bulkCreate(failedSentReminders);
        console.log(`---- ${errors.length} => saved sentReminders that would fail`);
      } catch (err) {
        console.error(`---- Failed bulk saving of sentReminders that would fail`);
        console.error(err);
        // TODO: do we want to throw the error hear and ignore trying to send?
      }
    }

    console.log(`---- ${success.length} => reminders that should succeed`);
    for (const { patient, primaryType } of success) {
      const { appointment } = patient;
      // const { primaryType } = reminder;

      // Save sent reminder first so we can
      // - use sentReminderId as token in email
      // - keep track of failed reminders
      const sentReminder = await SentReminder.create({
        reminderId: reminder.id,
        accountId: account.id,
        patientId: patient.id,
        appointmentId: appointment.id,
        interval: reminder.interval,
        isConfirmable: getIsConfirmable(appointment),
        primaryType,
      });

      sentReminderIds.push(sentReminder.id);

      let data = null;
      try {
        data = await sendReminder[primaryType]({
          patient,
          account,
          appointment,
          sentReminder,
        });

        console.log(`------ Sent '${interval} ${primaryType}' reminder to ${patient.firstName} ${patient.lastName}`);
      } catch (error) {
        console.error(`------ Failed sending '${interval} ${primaryType}' reminder to ${patient.firstName} ${patient.lastName}`);
        console.error(error);
        continue;
      }

      await sentReminder.update({ isSent: true });
      const appt = await Appointment.findById(appointment.id);
      appt.update({ isReminderSent: true });

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
        global.io && await sendSocket(global.io, chat.id);
      }
    }

    pub && pub.publish('REMINDER:SENT:BATCH', JSON.stringify(sentReminderIds));
  }

  console.log(`Reminders completed for ${account.name} (${account.id})!`);
}

/**
 *
 * @returns {Promise.<Array|*>}
 */
export async function computeRemindersAndSend({ date, pub }) {
  // Get all clinics that actually want reminders sent and get their Reminder Preferences
  // const accounts = await Account.filter({ canSendReminders: true }).getJoin(joinObject).run();
  const accounts = await Account.findAll({
    where: {
      canSendReminders: true,
    },

    // We have to sort in JS until Sequelize gets interval types for Postgres
    // order: [[{ model: Reminder, as: 'reminders' }, 'lengthSeconds', 'asc']],

    include: [{
      model: Reminder,
      as: 'reminders',
      where: {
        isDeleted: false,
        isActive: true,
      },
    }],
  });

  for (const account of accounts) {
    // use `exports.` because we can mock it and stub it in test suite
    await exports.sendRemindersForAccount(account.get({ plain: true }), date, pub);
  }
}
