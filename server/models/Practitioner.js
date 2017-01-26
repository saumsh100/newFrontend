const thinky = require('../config/thinky');
const type = thinky.type;

const Practitioner = thinky.createModel('Practitioner', {
  id: type.string().uuid(4),
  accountId: type.string().uuid(4),
  firstName: type.string().required(),
  lastName: type.string().required(),
  serviceId: type.string().uuid(4),
});

module.exports = Practitioner;
