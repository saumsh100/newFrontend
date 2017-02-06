
const thinky = require('../config/thinky');

const type = thinky.type;

const Patient = thinky.createModel('Patient', {
  id: type.string().uuid(4),
  firstName: type.string().required(),
  lastName: type.string().required(),
  phoneNumber: type.string(),
  accountId: type.string(),
  insurance: type.object().allowNull(),
  //createdAt: type.date().default(thinky.r.now()),
});

Patient.defineStatic('findByPhoneNumber', function (phoneNumber) {
  return this.filter({ phoneNumber }).nth(0).run();
});

module.exports = Patient;
