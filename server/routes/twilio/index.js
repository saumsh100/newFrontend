
const twilioRouter = require('express').Router();
const TextMessage = require('../../models/TextMessage');
const Appointment = require('../../models/Appointment');
const Chat = require('../../models/Chat');
const Token = require('../../models/Token');
const Patient = require('../../models/Patient');
const thinky = require('../../config/thinky');
const twilio = require('../../config/globals').twilio;
const twilioClient = require('../../config/twilio');
const { namespaces } = require('../../config/globals');
const normalize = require('../api/normalize');


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

twilioRouter.post('/message', (req, res, next) => {
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

  const Body = req.body.Body.trim();



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

      Chat.filter({patientId: patient.id}).run().then((test) => {
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

      if (Body === 'C') {
        Appointment.filter({ patientId: patient.id, confirmed: false })
          .getJoin({
            account: true,
            practitioner: { services: false },
            service: { practitioners: false },
          }).orderBy('startTime')
          .then((appArray) => {
            appArray[0].merge({ confirmed: true }).save().then((confApp) => {
              console.log(appArray[0]);
              twilioClient.sendMessage({
                from: twilio.number,
                to: patient.mobilePhoneNumber,
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
          });
      }
    })
    .catch(() => {
      // Assume the Patient does not exist.
      console.log(`Received communication from unknown number: ${From}.`);
      TextMessage.save(textMessageData);
    });

  // For twilio... needs a response
  // TODO: Do we need to res.send on successful saving?
  res.send();
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
  res.send();
});

module.exports = twilioRouter;
