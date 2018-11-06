
export default function (sequelize, DataTypes) {
  const AccountTemplate = sequelize.define('AccountTemplate', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: true,
    },

    templateId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    value: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  AccountTemplate.associate = ({ Account, Template }) => {
    AccountTemplate.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    AccountTemplate.belongsTo(Template, {
      foreignKey: 'templateId',
      as: 'template',
    });
  };

  return AccountTemplate;
}
