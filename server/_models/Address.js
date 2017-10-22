
export default function (sequelize, DataTypes) {
  const Address = sequelize.define('Address', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    street: {
      type: DataTypes.STRING,
    },

    country: {
      type: DataTypes.STRING,
    },

    state: {
      type: DataTypes.STRING,
    },

    city: {
      type: DataTypes.STRING,
    },

    zipCode: {
      type: DataTypes.STRING,
    },

    timezone: {
      type: DataTypes.STRING,
    },
  });

  Address.associate = ({ Account }) => {
    Address.hasOne(Account, {
      foreignKey: 'addressId',
      as: 'accounts',
    });
  };

  return Address;
}
