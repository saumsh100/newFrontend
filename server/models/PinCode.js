
const thinky = require('../config/thinky');
const createModel = require('./createModel');
const type = thinky.type;

// Unique 4 digit code
const code4 = () => {
  return Math.floor(1000 + (Math.random() * 9000)).toString();
};

// Used to verify all types of User's phone number
const PinCode = createModel('PinCode', {
  pinCode: type.string().required(),
  modelId: type.string().uuid(4).required(),
}, {
  pk: 'pinCode',
});

// TODO: change to findOne as a general Model function
PinCode.defineStatic('generateConfirmation', function (modelId) {
  const pinCode = code4();
  return this.save({
    pinCode,
    modelId,
  });
});

module.exports = PinCode;
