
const thinky = require('../config/thinky');
const type = thinky.type;

const TextMessage = thinky.createModel('TextMessage', {
  // Twilio MessageSID
  id: type.string().required(),
  patientId: type.string(),
  accountId: type.string(),
  // Twilio Data
  to: type.string(),
  from: type.string(),
  body: type.string(),
  smsStatus: type.string(),
  createdAt: type.date(),
  dateCreated: type.date(),
  dateUpdated: type.date(),
  apiVersion: type.string(),
  accountSid: type.string(),
  read: type.boolean().default(false),
  senderId: type.string(),
  // Depends on carrier if populated I believe
  toZip: type.string(),
  toCity: type.string(),
  toState: type.string(),
  toCountry: type.string(),
  fromZip: type.string(),
  fromCity: type.string(),
  fromState: type.string(),
  fromCountry: type.string(),

  // Pictures/Videos/Audio Files
  numMedia: type.number().integer(),
  numSegments: type.number().integer(),

  // Twilio does { MediaUrl0, MediaUrl1, MediaContentType0, MediaContentType1 }
  // This is easier...
  mediaData: type.object(),
});

module.exports = TextMessage;
