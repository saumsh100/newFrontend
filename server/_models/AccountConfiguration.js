export default function (sequelize, DataTypes) {
  const AccountConfiguration = sequelize.define('AccountConfiguration', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    value: {
      type: DataTypes.STRING,
    },

    configurationId: {
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
        fields: ['accountId', 'configurationId'],
      },
    },
  });

  AccountConfiguration.associate = (models) => {
    const {
      Account,
      Configuration,
    } = models;

    AccountConfiguration.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    AccountConfiguration.belongsTo(Configuration, {
      foreignKey: 'configurationId',
      as: 'configuration',
    });
  };

  return AccountConfiguration;
}
