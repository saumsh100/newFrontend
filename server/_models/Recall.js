
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
      defaultValue: PRIMARY_TYPES.EMAIL,
      values: Object.keys(PRIMARY_TYPES).map(key => PRIMARY_TYPES[key]),
      allowNull: false,
    },

    primaryTypes: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
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

    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
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
