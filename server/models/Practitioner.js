const thinky = require('../config/thinky');

const type = thinky.type;

const Practitioner = thinky.createModel('Practitioner', {
  id: type.string().uuid(4).required(),
  accountId: type.string().uuid(4).required(),
  firstName: type.string().required(),
  lastName: type.string().required(),
  services: [type.string().uuid(4).required()],
});

module.exports = Practitioner;
