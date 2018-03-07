
import { Router } from 'express';
import {
  Account,
  Chat,
  Patient,
  TextMessage,
  SentReminder,
  Appointment
} from '../../../_models';
import { getValidSmsReminders } from '../../../lib/reminders/helpers';
import { createConfirmationText } from '../../../lib/reminders/sendReminder';
import { sequelizeLoader } from '../../util/loaders';
import { sanitizeTwilioSmsData } from '../util';
import { isSmsConfirmationResponse } from '../../../lib/comms/util/responseChecks';
import twilio from 'twilio';
import twilioClient from '../../../config/twilio';
import { namespaces } from '../../../config/globals';
import normalize from '../../_api/normalize';

const smsRouter = Router();

smsRouter.param('accountId', sequelizeLoader('account', 'Account'));

function sendSocket(io, chatId) {
  return Chat.findOne({
    where: { id: chatId },
    include: [
      {
        model: TextMessage,
        as: 'textMessages',
        required: false,
      },
      {
        model: Patient,
        as: 'patient',
        required: false,
      },
    ],
  }).then((chat) => {
    console.log('Found chat', chat.id);
    io.of(namespaces.dash)
      .in(chat.accountId)
      .emit('newMessage', normalize('chat', chat.get({ plain: true })));
  });
}

function sendSocketReminder(io, sentReminder) {
  return SentReminder.findOne({
    where: {
      id: sentReminder.id,
    },
    include: [
      {
        model: Appointment,
        as: 'appointment',
      },
    ],
  }).then((sentReminderOne) => {
    const sentReminderData = sentReminderOne.get({ plain: true });
    io.of('/dash')
      .in(sentReminder.accountId)
      .emit('create:SentReminder', normalize('sentReminder', sentReminderData));
  });
}

/**
 * Twilio SMS Webhook
 * - need to add twilio.webhook() when we separate environments on prod, staging and local
 */
smsRouter.post('/accounts/:accountId', async (req, res, next) => {
  try {
    console.log(`Received twilio message on /accounts/${req.account.id}`);

    // Twilio needs to have a certain type associated with the response
    res.type('xml');

    let {
      account,
    } = req;

    const {
      From,
      Body,
    } = req.body;

    account = account.get({ plain: true });

    const io = req.app.get('socketio');
    const textMessageData = sanitizeTwilioSmsData(req.body);

    // Grab account from incoming number so that we can get accountId
    const patient = await Patient.findOne({
      where: {
        accountId: account.id,
        mobilePhoneNumber: From,
      },
    });

    let chat = await Chat.findOne({
      where: {
        accountId: account.id,
        patientPhoneNumber: From,
        patientId: {
          $ne: null,
        },
      },
    });

    if (!chat || !patient) {
      chat = await Chat.findOne({
        where: {
          accountId: account.id,
          patientPhoneNumber: From,
          patientId: {
            $eq: null,
          },
        },
      });
    }

    if (!chat) {
      chat = await Chat.create({
        accountId: account.id,
        patientId: patient && patient.id,
        patientPhoneNumber: From,
      });
    }

    const chatClean = chat.get({ plain: true });

    // Now save TM
    const textMessage = await TextMessage.create(Object.assign(
      {},
      textMessageData,
      { chatId: chatClean.id }
    ));

    const textMessageClean = textMessage.get({ plain: true });

    // Update Chat to have new textMessage
    await chat.update({ lastTextMessageId: textMessageClean.id, lastTextMessageDate: textMessageClean.createdAt });

    // If not patient or if not a valid sms confirmation response just return
    if (!patient || !isSmsConfirmationResponse(Body)) {
      await sendSocket(io, chatClean.id);
      return res.end();
    }

    // Confirm reminder if any exist
    const validSmsReminders = await getValidSmsReminders({
      patientId: patient.id,
      accountId: account.id,
    });


    if (!validSmsReminders.length) {
      await sendSocket(io, chatClean.id);
      return res.end();
    }

    // Confirm first available reminder
    const validSentReminder = validSmsReminders[0];
    const { appointment, reminder } = validSentReminder;
    const sentReminder = validSentReminder.get({ plain: true });

    await SentReminder.update({ isConfirmed: true }, { where: { id: sentReminder.id } });
    await appointment.confirm(reminder);
    await sendSocketReminder(io, sentReminder);

    // Mark this as read cause we are auto-responding to it
    await textMessage.update({ read: true });

    const responseMessage = await twilioClient.sendMessage({
      from: account.twilioPhoneNumber,
      to: patient.mobilePhoneNumber,
      body: createConfirmationText({ patient, appointment, account, reminder }),
    });

    const responseTextMessageData = sanitizeTwilioSmsData(responseMessage);
    let responseTextMessage = await TextMessage.create(Object.assign(
      {},
      responseTextMessageData,
      { chatId: chatClean.id, read: true }
    ));

    responseTextMessage = responseTextMessage.get({ plain: true });

    await chat.update({
      lastTextMessageId: responseTextMessage.id,
      lastTextMessageDate: responseTextMessage.createdAt,
    });

    await sendSocket(io, chatClean.id);
    res.end();
  } catch (err) {
    next(err);
  }
});

// Receive all status updates to a message
smsRouter.post('/status', (req, res, next) => {
  const {
    MessageSid,
    MessageStatus,
  } = req.body;

  // Update that message with the new status
  TextMessage.findById(MessageSid).run()
    .then((textMessage) => {
      textMessage.update({ status: MessageStatus })
        .then(() => console.log(`Updated ${MessageSid} message to ${MessageStatus}!`))
        .catch(next);
    })
    .catch(next);

  // For twilio... needs a response
  res.end();
});

export default smsRouter;
