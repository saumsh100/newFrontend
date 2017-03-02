
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

const OfficeHours = createModel('OfficeHours', {
  // All operationalHoursIds
  mondayId: type.string().uuid(4),
  tuesdayId: type.string().uuid(4),
  wednesdayId: type.string().uuid(4),
  thursdayId: type.string().uuid(4),
  fridayId: type.string().uuid(4),
  saturdayId: type.string().uuid(4),
  sundayId: type.string().uuid(4),
});

module.exports = OfficeHours;
