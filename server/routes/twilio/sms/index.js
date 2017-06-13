
import { Router } from 'express';
import {
  Account,
  Chat,
  Patient,
  TextMessage,
} from '../../../models';
import { getValidSmsReminders } from '../../../lib/reminders/helpers';
import { createConfirmationText } from '../../../lib/reminders/sendReminder';
import loaders from '../../util/loaders';
import { sanitizeTwilioSmsData } from '../util';
import twilioClient from '../../../config/twilio';
import { namespaces } from '../../../config/globals';
import normalize from '../../api/normalize';

const smsRouter = Router();

smsRouter.param('accountId', loaders('account', 'Account'));

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
        .in(chat.accountId)
        .emit('newMessage', normalize('chat', chat));
    });
}

smsRouter.post('/accounts/:accountId', async (req, res, next) => {
  try {
    // We close response fast, does this help?
    res.end();

    const {
      account,
    } = req;

    const {
      From,
      Body,
    } = req.body;

    const io = req.app.get('socketio');
    const textMessageData = sanitizeTwilioSmsData(req.body);

    // Grab account from incoming number so that we can get accountId
    // TODO: change to aux table fetch?
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
    const validSmsReminders = await getValidSmsReminders({
      patientId: patient.id,
      accountId: account.id,
    });

    if (!validSmsReminders.length) {
      await sendSocket(io, chat.id);
      return;
    }

    // Confirm first available reminder
    const sentReminder = validSmsReminders[0];
    const { appointment } = sentReminder;
    await sentReminder.merge({ isConfirmed: true }).save();
    await appointment.merge({ isConfirmed: true }).save();

    // Mark this as read cause we are auto-responding to it
    await textMessage.merge({ read: true }).save();

    const responseMessage = await twilioClient.sendMessage({
      from: account.twilioPhoneNumber,
      to: patient.mobilePhoneNumber,
      body: createConfirmationText({ patient, appointment, account }),
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
smsRouter.post('/status', (req, res, next) => {
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

export default smsRouter;
