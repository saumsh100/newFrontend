
// Unique 4 digit code
const code4 = () => Math.floor(1000 + (Math.random() * 9000)).toString();

export default function (sequelize, DataTypes) {
  const PinCode = sequelize.define('PinCode', {
    id: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },

    pinCode: {
      type: DataTypes.STRING,
      // We gotta make sure we remove these or else PK will conflict
      defaultValue: () => code4(),
    },

    modelId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  return PinCode;
}
