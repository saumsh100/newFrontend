
const { validatePhoneNumber } = require('./validators');

const createObject = (extraConfig = {}, config) =>
  Object.assign(
    {},
    config,
    extraConfig
  );

module.exports = {
  phoneNumber: (fieldName, DataTypes, config) => createObject(config, {
    type: DataTypes.STRING,
    set(val) {
      this.setDataValue(fieldName, validatePhoneNumber(val));
    },
  }),
}
