
import { Router } from 'express';
import {
  Appointment,
  Account,
  Chat,
  Patient,
  SentReminder,
  TextMessage,
  Token,
} from '../../models';
import { getValidSmsReminders } from '../../lib/reminders/helpers';
import { createConfirmationText } from '../../lib/reminders/sendReminder';
import { sanitizeTwilioSmsData } from './util';

const thinky = require('../../config/thinky');
const voiceRouter = require('./voice');
const twilioClient = require('../../config/twilio');
const { namespaces } = require('../../config/globals');
const normalize = require('../api/normalize');

const twilioRouter = Router();

// Set up automated Call interaction
twilioRouter.use('/voice', voiceRouter);

// Receive all incoming SMS traffic to the Twilio number

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
      io.of(namespaces.dash)
        .in(chat.patient.accountId)
        .emit('newMessage', normalize('chat', chat));
    });
}

twilioRouter.post('/message', async (req, res, next) => {
  try {
    // We close response fast, does this help?
    res.end();

    const {
      To,
      From,
      Body,
    } = req.body;

    const io = req.app.get('socketio');
    const textMessageData = sanitizeTwilioSmsData(req.body);

    // TODO: perhaps we could make phoneNumber the primary key for Chat

    // Grab account from incoming number so that we can get accountId
    // TODO: change to aux table fetch?
    // TODO: perhaps we change the webhooks in the Twilio service to route to /:accountId/messages
    const accounts = await Account.filter({ twilioPhoneNumber: To });
    const account = accounts[0];
    if (!account) {
      console.log(`Received '${Body}' from ${From}. The number is not associated with any Account.`);
      return;
    }

    const patients = await Patient.filter({ accountId: account.id, mobilePhoneNumber: From });//.getJoin({ sentReminders: true });
    const patient = patients[0];
    if (!patient) {
      console.log(`Unknown Patient Number: ${From}`);
    }

    const chats = await Chat.filter({ accountId: account.id, patientPhoneNumber: From });

    let chat = chats[0];
    if (!chat) {
      chat = await Chat.save({
        accountId: account.id,
        patientId: patient && patient.id,
        patientPhoneNumber: From,
        // lastTextMessageDate: new Date(),
        // lastTextMessageId: textMessage.id
      });
    }

    // Now save TM
    const textMessage = await TextMessage.save(Object.assign({}, textMessageData, { chatId: chat.id }));

    // Update Chat to have new textMessage
    await chat.merge({ lastTextMessageId: textMessage.id, lastTextMessageDate: textMessage.createdAt }).save();

    // If not patient or if not any valid sms sentReminders or if not proper response
    if (!patient || Body.trim() !== 'C') {
      await sendSocket(io, chat.id);
      return;
    }

    // Confirming valid SMS Reminder for patient
    /*const validSmsReminders = await getValidSmsReminders({
      patientId: patient.id,
      accountId: account.id,
    });

    if (!validSmsReminders.length) {
      await sendSocket(io, chat.id);
      return;
    }*/

    // Confirm first available reminder
    //const sentReminder = validSmsReminders[0];
    //const { appointment } = sentReminder;
    //await sentReminder.merge({ isConfirmed: true }).save();

    // Mark this as read cause we are auto-responding to it
    await textMessage.merge({ read: true }).save();

    const responseMessage = await twilioClient.sendMessage({
      from: account.twilioPhoneNumber,
      to: patient.mobilePhoneNumber,
      body: createConfirmationText({ patient, appointment: {}, account }),
    });

    const responseTextMessageData = sanitizeTwilioSmsData(responseMessage);
    const responseTextMessage = await TextMessage.save(Object.assign({}, responseTextMessageData, { chatId: chat.id, read: true }));
    await chat.merge({
      lastTextMessageId: responseTextMessage.id,
      lastTextMessageDate: responseTextMessage.createdAt,
    }).save();

    await sendSocket(io, chat.id);
  } catch (err) {
    next(err);
  }
});

// Receive all status updates to a message
twilioRouter.post('/status', (req, res, next) => {
  const {
    MessageSid,
    MessageStatus,
  } = req.body;

  // Update that message with the new status
  TextMessage.get(MessageSid).run()
    .then((textMessage) => {
      textMessage.status = MessageStatus;
      textMessage.save()
        .then(tm => console.log(`Updated ${tm.messageSid} message to ${tm.status}!`))
        .catch(next);
    })
    .catch(next);

  // For twilio... needs a response
  res.end();
});

module.exports = twilioRouter;

function delay(seconds) {
  return Promise((resolve, reject) => {
    setTimeout(() => {
      resolve();
    }, seconds);
  });
}
