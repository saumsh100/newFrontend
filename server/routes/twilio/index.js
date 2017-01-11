/**
 * Created by jsharp on 2016-11-22.
 *
 *      Varafy Inc.
 *
 */

const twilioRouter = require('express').Router();
const TextMessage = require('../../models/TextMessage');
const Appointment = require('../../models/Appointment');
const Patient = require('../../models/Patient');
const thinky = require('../../config/thinky');
const twilio = require('../../config/globals').twilio;
const twilioClient = require('../../config/twilio');

// Receive all incoming SMS traffic to the Twilio number

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
    id: MessageSid,
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
      TextMessage.save(textMessageData);
      if (Body === 'C') {
        Appointment.filter({ patientId: patient.id, confirmed: false }).orderBy('startTime').run().then((appArray) => {
          appArray[0].merge({ confirmed: true }).save().then((confirmedAppointment) => {
            console.log(confirmedAppointment);
            twilioClient.sendMessage({
              from: twilio.number,
              to: patient.phoneNumber,
              body: 'Your Appointment is now confirmed!',
            })
            .then(result => console.log(result));
          });
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
