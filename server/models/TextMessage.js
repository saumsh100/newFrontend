
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const TextMessage = createModel('TextMessage', {
  // Twilio MessageSID
  chatId: type.string().uuid(4).required(),

  // Twilio Data
  to: type.string().required(),
  from: type.string().required(),
  body: type.string().required(),
  smsStatus: type.string(),
  dateCreated: type.date(),
  dateUpdated: type.date(),
  apiVersion: type.string(),
  accountSid: type.string(),
  read: type.boolean().default(false),

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
