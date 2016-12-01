
const thinky = require('../config/thinky');
const type = thinky.type;

const Patient = thinky.createModel('Patient', {
  id: type.string(),
  firstName: type.string().required(),
  lastName: type.string().required(),
  phoneNumber: type.string().required(),
}, {
  pk: 'id',
});

module.exports = Patient;
