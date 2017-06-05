
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const PreferencesSchema = type.object().schema({
  mornings: type.boolean().default(true),
  afternoons: type.boolean().default(true),
  evenings: type.boolean().default(true),
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

