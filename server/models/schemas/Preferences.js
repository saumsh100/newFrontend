
const thinky = require('../../config/thinky');
const type = thinky.type;

const generatePreferencesSchema = (options = {}) => {
  return type.object().schema({
    morning: type.boolean().default(true),
    afternoon: type.boolean().default(true),
    evening: type.boolean().default(true),
    weekdays: type.boolean().default(true),
    weekends: type.boolean().default(true),
    sms: type.boolean().default(true),
    emailNotifications: type.boolean().default(true),
    phone: type.boolean().default(true),
    reminders: type.boolean().default(true),
    newsletter: type.boolean().default(true),
    birthdayMessage: type.boolean().default(true),
  }).default({
    morning: true,
    afternoon: true,
    evening: true,
    weekdays: true,
    weekends: true,
    sms: true,
    email: true,
    phone: true,
    reminders: true,
    newsletter: true,
    birthdayMessage: true,
  }).removeExtra();
};

const PreferencesSchema = generatePreferencesSchema();

module.exports.generatePreferencesSchema = generatePreferencesSchema;
module.exports = PreferencesSchema;
