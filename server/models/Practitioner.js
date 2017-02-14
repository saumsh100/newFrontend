
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Practitioner = createModel('Practitioner', {
  accountId: type.string().uuid(4).required(),
  firstName: type.string().required(),
  lastName: type.string().required(),
  services: [type.string().uuid(4).required()],
});

module.exports = Practitioner;
