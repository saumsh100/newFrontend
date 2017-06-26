
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const globals = require('../config/globals');
const type = thinky.type;
const { validatePhoneNumber } = require('../util/validators');

const Account = createModel('Account', {
  name: type.string().required(),
  street: type.string(),
  country: type.string(),
  state: type.string(),
  city: type.string(),
  zipCode: type.string(),
  vendastaId: type.string(),
  timeInterval: type.number(),
  timezone: type.string(),
  twilioPhoneNumber: type.string(),
  destinationPhoneNumber: type.string(),
  phoneNumber: type.string(),
  contactEmail: type.string(),
  website: type.string(),
  logo: type.string(),
  fullLogoUrl: type.virtual().default(function () {
    return this.logo ? `${globals.s3.urlPrefix}${this.logo}` : null;
  }),

  clinicName: type.string(),
  bookingWidgetPrimaryColor: type.string(),
  weeklyScheduleId: type.string().uuid(4),
  enterpriseId: type.string().uuid(4).required(),

  // Application "Addons"
  canSendReminders: type.boolean().default(false),
  canSendRecalls: type.boolean().default(false),
  unit: type.number().default(15),
});

Account.docOn('saving', validatePatient); // <<< doc is in `doc` param

function validatePatient(doc) {
  validatePhoneNumbers(doc);
}

function validatePhoneNumbers(doc) {
  doc.destinationPhoneNumber = validatePhoneNumber(doc.destinationPhoneNumber);
  doc.twilioPhoneNumber = validatePhoneNumber(doc.twilioPhoneNumber);
  doc.phoneNumber = validatePhoneNumber(doc.phoneNumber);
}

module.exports = Account;
