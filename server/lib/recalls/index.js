
import moment from 'moment-timezone';
import { Account, Patient, SentRecall, Recall, Chat, TextMessage } from '../../_models';
import {
  getPatientsDueForRecall,
  mapPatientsToRecalls,
} from './helpers';
import { generateOrganizedPatients } from '../comms/util';
import { sanitizeTwilioSmsData } from '../../routes/twilio/util';
import { convertIntervalStringToObject } from '../../util/time';
import normalize from '../../routes/api/normalize';
import sendRecall from './sendRecall';
import app from '../../bin/app';
import { namespaces, env } from '../../config/globals';

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
 * sendRecallsForAccount
 *
 * @param account
 * @param date
 * @returns {Promise.<void>}
 */
export async function sendRecallsForAccount(account, date, pubSocket) {
  console.log(`Sending recalls for ${account.name}`);
  const { recalls, name } = account;

  const recallsPatients = await mapPatientsToRecalls({ recalls, account, startDate: date });

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
    const { primaryTypes, interval } = recall;

    try {
      const recallName = `'${interval} ${primaryTypes.join(' & ')}'`;

      console.log(`-- Sending ${recallName} reminder...`);
      console.log(`---- ${errors.length} => sentRecalls that would fail`);

      // Save failed sentRecalls from errors
      const failedSentRecalls = errors.map(({ errorCode, patient, primaryType }) => ({
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

    // Save ids of recalls sent as we are sending them
    const sentRecallsIds = [];

    console.log(`---- ${success.length} => recall that should succeed`);
    for (const { patient, primaryType } of success) {
      // Check if latest appointment is within the recall window
      //
      const sentRecall = await SentRecall.create({
        recallId: recall.id,
        accountId: account.id,
        patientId: patient.id,
        lengthSeconds: recall.lengthSeconds,
        interval: recall.interval,
        primaryType,
      });

      const lastAppointment = patient.hygiene ? patient.lastHygieneDate : patient.lastRecallDate;
      let data = null;
      try {
        let dueDate;
        if (patient.hygiene) {
          dueDate = account.timezone ? moment.tz(patient.lastHygieneDate, account.timezone)
            : moment(patient.lastHygieneDate);
        } else {
          dueDate = account.timezone ? moment.tz(patient.lastRecallDate, account.timezone)
            : moment(patient.lastHygieneDate);
        }

        dueDate = dueDate
            .add(1, 'days')
            .add(convertIntervalStringToObject(patient.insuranceInterval || account.hygieneInterval))
            .toISOString();

        data = await sendRecall[primaryType]({
          patient,
          account,
          lastAppointment,
          sentRecall,
          recall,
          dueDate,
        });
      } catch (error) {
        console.log(`${primaryType} recall NOT SENT to ${patient.firstName} ${patient.lastName} for ${name} because:`);
        console.error(error);
        continue;
      }

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

        // Now update the clients in real-time
        global.io && await sendSocket(global.io, chat.id);
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
      where: {
        isDeleted: false,
        isActive: true,
      },
    }],
  });

  for (const account of accounts) {
    // use `exports.` because we can mock it and stub it in test suite

    const startHour = Number(account.recallStartTime.split(':')[0]);
    const startMin = Number(account.recallStartTime.split(':')[1]);

    const endHour = Number(account.recallEndTime.split(':')[0]);
    const endMin = Number(account.recallEndTime.split(':')[1]);

    const startDate = account.timezone ?
      moment.tz(date, account.timezone).hours(startHour).minutes(startMin).toISOString() :
      moment(date).hours(startHour).minutes(startMin).toISOString();

    const endDate = account.timezone ?
      moment.tz(date, account.timezone).hours(endHour).minutes(endMin).toISOString() :
      moment(date).hours(endHour).minutes(endMin).toISOString();

    const dateNow = moment(date);

    if ((dateNow.isBefore(endDate) && dateNow.isAfter(startDate))
     || ((dateNow.isSame(startDate) || dateNow.isSame(endDate)))
    ) {
      await exports.sendRecallsForAccount(account.get({ plain: true }), date, publishSocket);
    }
  }
}
