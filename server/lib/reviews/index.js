
import moment from 'moment';
import {
  Account,
  Appointment,
  Chat,
  Patient,
  SentReview,
  TextMessage,
} from '../../_models';
import { env } from '../../config/globals';
import normalize from '../../routes/api/normalize';
import { sanitizeTwilioSmsData } from '../../routes/twilio/util';
import { getReviewPatients } from './helpers';
import sendReview from './sendReview';

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

export async function sendReviewsForAccount(account, date, pub) {
  const { name } = account;
  console.log(`Sending reviews for ${name} (${account.id}) at ${moment(date).format('YYYY-MM-DD h:mma')}...`);

  const { success, errors } = await getReviewPatients({ account, startDate: date });
  try {
    console.log(`---- ${errors.length} => sentReviews that would fail`);

    // Save failed sentRecalls from errors
    const failedSentReviews = errors.map(({ errorCode, patient }) => ({
      accountId: account.id,
      practitionerId: patient.appointment.practitionerId,
      patientId: patient.id,
      appointmentId: patient.appointment.id,
      errorCode,
    }));

    await SentReview.bulkCreate(failedSentReviews);
    console.log(`------ ${errors.length} => saved sentReviews that would fail`);
  } catch (err) {
    console.error(`------ Failed bulk saving of sentReviews that would fail`);
    console.error(err);
  }

  console.log(`---- ${success.length} review requests that should succeed`);

  const sentReviewIds = [];
  for (const { patient, primaryType } of success) {
    const { appointment } = patient;
    const { practitioner } = appointment;

    // Save sent review first so we can
    // - use sentReviewId as token in email to identify patient on review form
    // - keep track of failed review comms
    const sentReview = await SentReview.create({
      accountId: account.id,
      practitionerId: appointment.practitionerId,
      patientId: patient.id,
      appointmentId: appointment.id,
      primaryType,
    });

    let data = null;
    try {
      data = await sendReview[primaryType]({
        patient,
        account,
        appointment,
        sentReview,
        practitioner,
      });

      sentReviewIds.push(sentReview.id);

      console.log(`------ Sent '${primaryType}' review request to ${patient.firstName} ${patient.lastName}`);
    } catch (error) {
      console.error(`------ Failed sending '${primaryType}' review request to ${patient.firstName} ${patient.lastName}`);
      console.error(error);
      continue;
    }

    // If sendReview was successful, then update isSent
    await sentReview.update({ isSent: true });

    // This needs to be refactored into a Chat lib module
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
  }

  pub && pub.publish('REVIEW:SENT:BATCH', JSON.stringify(sentReviewIds));
  console.log(`Reviews completed for ${name} (${account.id})!`);
}

/**
 *
 * @returns {Promise.<Array|*>}
 */
export async function computeReviewsAndSend({ date, pub }) {
  // Fetch accounts that have reviews turned on
  const accounts = await Account.findAll({
    where: {
      canSendReviews: true,
    },
  });

  // Be sure it runs on the minute
  date = moment(date).seconds(0).milliseconds(0).toISOString();

  for (const account of accounts) {
    await exports.sendReviewsForAccount(account, date, pub);
  }
}
