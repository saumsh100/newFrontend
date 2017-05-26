
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const PreferencesSchema = type.object().schema({
  morning: type.boolean().default(true),
  afternoon: type.boolean().default(true),
  evening: type.boolean().default(true),
  weekdays: type.boolean().default(true),
  weekends: type.boolean().default(true),
}).default({
  mornings: true,
  afternoons: true,
  evenings: true,
  weekdays: true,
  weekends: true,
});

const WaitSpot = createModel('WaitSpot', {
  patientId: type.string().uuid(4).required(),
  accountId: type.string().uuid(4).required(),
  preferences: PreferencesSchema,
  unavailableDays: [type.date()],
});

module.exports = WaitSpot;

