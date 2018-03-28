
const { validatePhoneNumber } = require('./validators'); // changing these to const so that sequelize can run migrations

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
};
