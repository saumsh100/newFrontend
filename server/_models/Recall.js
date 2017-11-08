
const PRIMARY_TYPES = {
  PHONE: 'phone',
  EMAIL: 'email',
  SMS: 'sms',
};

export default function (sequelize, DataTypes) {
  const Recall = sequelize.define('Recall', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    primaryType: {
      type: DataTypes.ENUM,
      values: Object.keys(PRIMARY_TYPES).map(key => PRIMARY_TYPES[key]),
      // TODO: maybe a default value?
      allowNull: false,
    },

    lengthSeconds: {
      type: DataTypes.INTEGER,
    },

    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      allowNull: false,
    },
  });

  Recall.associate = ({ Account }) => {
    Recall.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });
  };

  return Recall;
}
