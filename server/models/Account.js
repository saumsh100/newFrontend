
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
  twilioPhoneNumber: type.string(),
  destinationPhoneNumber: type.string(),
  logo: type.string(),
  fullLogoUrl: type.virtual().default(function () {
    return this.logo ? `${globals.s3.urlPrefix}${this.logo}` : null;
  }),
  clinicName: type.string(),
  bookingWidgetPrimaryColor: type.string(),
  weeklyScheduleId: type.string().uuid(4),
  enterpriseId: type.string().uuid(4).required(),

  // Application "Addons"
  canSendReminders: type.boolean().default(true),
  canSendRecalls: type.boolean().default(true),
});

Account.docOn('saving', validatePatient); // <<< doc is in `doc` param

function validatePatient(doc) {
  validatePhoneNumbers(doc);
}

function validatePhoneNumbers(doc) {
  doc.destinationPhoneNumber = validatePhoneNumber(doc.destinationPhoneNumber);
  doc.twilioPhoneNumber = validatePhoneNumber(doc.twilioPhoneNumber);
}

module.exports = Account;
