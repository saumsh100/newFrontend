
const { type } = require('../config/thinky');
const createModel = require('./createModel');

const PHONE = 'phone';
const EMAIL = 'email';
const SMS = 'sms';

const Recall = createModel('Recall', {
  accountId: type.string().uuid(4).required(),
  primaryType: type.string().enum(SMS, PHONE, EMAIL).required(),
  lengthSeconds: type.number(),
});

module.exports = Recall;
