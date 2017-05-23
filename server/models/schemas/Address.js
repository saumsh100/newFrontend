
const thinky = require('../../config/thinky');
const type = thinky.type;

const generateAddressSchema = (options = {}) => {
  return type.object().schema({
    street: type.string(),
    city: type.string(),
    province: type.string(),
    country: type.string(),
    postalCode: type.string(),
  }).removeExtra();
};

const AddressSchema = generateAddressSchema();

module.exports.generateAddressSchema = generateAddressSchema;
module.exports = AddressSchema;
