
export default function (sequelize, DataTypes) {
  const Service = sequelize.define('Service', {
    id: {
      // TODO: why not use type UUIDV4
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    pmsId: {
      type: DataTypes.STRING,
    },

    duration: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    bufferTime: {
      type: DataTypes.INTEGER,
    },

    unitCost: {
      // TODO: is this correct?
      type: DataTypes.INTEGER,
    },

    isHidden: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    isDefault: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
    },
  });

  Service.associate = (({ Account, Practitioner }) => {
    Service.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Service.belongsToMany(Practitioner, {
      through: 'Practitioner_Service',
      as: 'practitioners',
      foreignKey: 'serviceId',
    });
  });

  return Service;
}
