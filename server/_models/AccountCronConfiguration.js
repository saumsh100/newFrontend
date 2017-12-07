export default function (sequelize, DataTypes) {
  const AccountCronConfiguration = sequelize.define('AccountCronConfiguration', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    value: {
      type: DataTypes.STRING,
    },

    cronConfigurationId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  }, {
    uniqueKeys: {
      actions_unique: {
        fields: ['accountId', 'cronConfigurationId'],
      },
    },
  });

  AccountCronConfiguration.associate = (models) => {
    const {
      Account,
      CronConfiguration,
    } = models;

    AccountCronConfiguration.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    AccountCronConfiguration.belongsTo(CronConfiguration, {
      foreignKey: 'cronConfigurationId',
      as: 'cronConfiguration',
    });
  };

  return AccountCronConfiguration;
}
