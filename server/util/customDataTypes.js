
import { validatePhoneNumber } from './validators';

const createObject = (extraConfig = {}, config) =>
  Object.assign(
    {},
    config,
    extraConfig
  );

export default {
  phoneNumber: (fieldName, DataTypes, config) => createObject(config, {
    type: DataTypes.STRING,
    set(val) {
      this.setDataValue(fieldName, validatePhoneNumber(val));
    },
  }),
}
