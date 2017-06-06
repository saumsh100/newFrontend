
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

  Chat.get(chatId).getJoin(joinObject).run()
    .then((chat) => {
      const send = JSON.stringify(normalize('chat', chat));
      io.of(namespaces.dash).in(chat.patient.accountId).emit('newMessage', send)
    }).catch((err) => {
    console.log(err);
  });
}

twilioRouter.post('/_message', (req, res, next) => {
  const {
    AccountSid,
    MessageSid,
    To,
    From,
    ToZip,
    ToCity,
    ToState,
    ToCountry,
    FromZip,
    FromCity,
    FromState,
    FromCountry,
    SmsStatus,
    NumMedia,
    NumSegments,
    ApiVersion,
  } = req.body;


  const io = req.app.get('socketio');
  const Body = req.body.Body;

  // Easily parse mediaData
  let mediaData = {};
  const numMedia = parseInt(NumMedia);
  if (numMedia) {
    for (let i = 0; i < numMedia; i++) {
      mediaData[i] = {
        url: req.body[`MediaUrl${i}`],
        contentType: req.body[`MediaContentType${i}`],
      };
    }
  }

  const currentDate = thinky.r.now();
  const textMessageData = {
    to: To,
    from: From,
    body: Body,
    smsStatus: SmsStatus,

    // TODO: fix unnecessary writing, fix defaults...
    createdAt: currentDate,
    dateCreated: currentDate,
    dateUpdated: currentDate,

    apiVersion: ApiVersion,
    accountSid: AccountSid,

    // Depends on carrier if populated
    toZip: ToZip,
    toCity: ToCity,
    toState: ToState,
    toCountry: ToCountry,
    fromZip: FromZip,
    fromCity: FromCity,
    fromState: FromState,
    fromCountry: FromCountry,
    numMedia: NumMedia,
    numSegments: NumSegments,
    mediaData,
  };

  Patient.findByPhoneNumber(From)
    .then((patient) => {
      console.log(`Received communication from ${patient.firstName}`);
      textMessageData.patientId = patient.id;

      const mergeData = {
        lastTextMessageDate: new Date(),
      };

      // TODO: change this
      Chat.filter({ patientId: patient.id }).run().then((test) => {
        if (test[0]) {
          textMessageData.chatId = test[0].id;
          TextMessage.save(textMessageData)
            .then(() => {
              test[0].merge(mergeData).save().then(() => {
                sendSocket(io, test[0].id);
              });
            });
        } else {
          mergeData.accountId = patient.accountId;
          mergeData.patientId = patient.id;
          Chat.save(mergeData).then((chat) => {
            textMessageData.chatId = chat.id;
            TextMessage.save(textMessageData)
              .then(() => {
                sendSocket(io, chat.id);
              });
          });
        }
      });

      if (Body.trim() === 'C') {
        // TODO: change this to check if last sms reminder !isConfirmed



        /*Appointment.filter({ patientId: patient.id, confirmed: false })
          .getJoin({
            account: true,
            practitioner: { services: false },
            service: { practitioners: false },
          })
          .orderBy('startTime')
          .then((appArray) => {
            appArray[0].merge({ confirmed: true }).save().then((confApp) => {
              console.log(appArray[0]);
              twilioClient.sendMessage({
                from: twilio.number,
                to: patient.mobilePhoneNumber,
                // TODO: change to a short Thank you...
                body: `Thank you! We have confirmed that you will be attending your ${appArray[0].service.name} appointment with ${appArray[0].practitioner.firstName} ${appArray[0].practitioner.lastName} from ${appArray[0].account.name}`,
              })
              .then(() => {
                Token.filter({ appointmentId: confApp.id }).run().then((t) => {
                  t[0].delete().then((deletedToken) => {
                    console.log(`Token ${deletedToken} was deleted`);
                  });
                }).catch(next);
              });
            })
            .catch(err => console.log(err));
          });*/
      }
    })
    .catch(() => {
      // Assume the Patient does not exist.
      console.log(`Received communication from unknown number: ${From}.`);
      TextMessage.save(textMessageData);
    });

  // For twilio... needs a response
  // TODO: Do we need to res.send on successful saving?
  res.end();
});

twilioRouter.post('/message', async (req, res, next) => {
  const {
    AccountSid,
    MessageSid,
    To,
    From,
    ToZip,
    ToCity,
    ToState,
    ToCountry,
    FromZip,
    FromCity,
    FromState,
    FromCountry,
    SmsStatus,
    NumMedia,
    NumSegments,
    ApiVersion,
  } = req.body;


  const io = req.app.get('socketio');
  const Body = req.body.Body;

  // Easily parse mediaData
  let mediaData = {};
  const numMedia = parseInt(NumMedia);
  if (numMedia) {
    for (let i = 0; i < numMedia; i++) {
      mediaData[i] = {
        url: req.body[`MediaUrl${i}`],
        contentType: req.body[`MediaContentType${i}`],
      };
    }
  }

  const currentDate = thinky.r.now();
  const textMessageData = {
    to: To,
    from: From,
    body: Body,
    smsStatus: SmsStatus,

    // TODO: fix unnecessary writing, fix defaults...
    createdAt: currentDate,
    dateCreated: currentDate,
    dateUpdated: currentDate,

    apiVersion: ApiVersion,
    accountSid: AccountSid,

    // Depends on carrier if populated
    toZip: ToZip,
    toCity: ToCity,
    toState: ToState,
    toCountry: ToCountry,
    fromZip: FromZip,
    fromCity: FromCity,
    fromState: FromState,
    fromCountry: FromCountry,
    numMedia: NumMedia,
    numSegments: NumSegments,
    mediaData,
  };

  // TODO: perhaps we could make phoneNumber the primary key for Chat

  // Grab account from incoming number so that we can get accountId
  // TODO: change to aux table fetch?
  // TODO: perhaps we change the webhooks in the Twilio service to route to /:accountId/messages
  const accounts = await Account.filter({ twilioPhoneNumber: To });
  const account = accounts[0];
  if (!account) {
    console.log(`Received '${body}' from ${From}. The number is not associated with any Account.`);
    return res.end();
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
  // If not patient or if not any valid sms sentReminders or if not proper response
  if (!patient || Body.trim() !== 'C') {
    return res.end();
  }

  // Confirming valid SMS Reminder for patient
  const validSmsReminders = getValidSmsReminders({
    patientId: patient.id,
    accountId: account.id,
  });

  if (!validSmsReminders.length) {
    return res.end();
  }

  // Confirm first available reminder
  await validSmsReminders[0].merge({ isConfirmed: true }).save();

  // For twilio... needs a response
  // TODO: Do we need to res.send on successful saving?
  res.end();
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
