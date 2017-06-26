
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const Practitioner_Service = createModel('Practitioner_Service', {
  id: type.string(),
  Practitioner_id: type.string().uuid(4).required(),
  Service_id: type.string().uuid(4).required(),
});

module.exports = Practitioner_Service;
