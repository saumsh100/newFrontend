
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const OfficeHours = createModel('OfficeHours', {
  // All operationalHoursIds
  monday: type.string().uuid(4),
  tuesday: type.string().uuid(4),
  wednesday: type.string().uuid(4),
  thursday: type.string().uuid(4),
  friday: type.string().uuid(4),
  saturday: type.string().uuid(4),
  sunday: type.string().uuid(4),
});

module.exports = OfficeHours;
