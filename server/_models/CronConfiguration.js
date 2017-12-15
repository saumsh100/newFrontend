export default function (sequelize, DataTypes) {
  const CronConfiguration = sequelize.define('CronConfiguration', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    defaultValue: {
      type: DataTypes.STRING,
    },

    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    type: {
      type: DataTypes.STRING,
    },
  });

  CronConfiguration.associate = (models) => {
    const {
      AccountCronConfiguration,
    } = models;

    CronConfiguration.hasOne(AccountCronConfiguration, {
      foreignKey: 'cronConfigurationId',
      as: 'accountCronConfiguration',
    });
  };

  return CronConfiguration;
}
