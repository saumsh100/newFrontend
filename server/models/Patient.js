
const thinky = require('../config/thinky');

const type = thinky.type;

const Patient = thinky.createModel('Patient', {
  id: type.string().uuid(4),
  firstName: type.string().required(),
  lastName: type.string().required(),
  phoneNumber: type.string().required(),
  //createdAt: type.date().default(thinky.r.now()),
  email: type.string().email(),
  appointmentPreference: type.string().enum(['email', 'sms', 'both']).default('both'),
});

Patient.defineStatic('findByPhoneNumber', function (phoneNumber) {
  return this.filter({ phoneNumber }).nth(0).run();
});

module.exports = Patient;
