const ROLES = {
  MANAGER: 'MANAGER',
  ADMIN: 'ADMIN',
  OWNER: 'OWNER',
};

export default function (sequelize, DataTypes) {
  const Invite = sequelize.define('Invite', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    enterpriseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    sendingUserId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    isDeleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    role: {
      type: DataTypes.ENUM,
      values: Object.keys(ROLES).map(key => ROLES[key]),
      defaultValue: 'MANAGER',
      allowNull: false,
    },

    email: {
      type: DataTypes.STRING,
      validate: {
        isEmail: true,
      },

      allowNull: false,
    },

    token: {
      type: DataTypes.STRING,
    },
  });

  Invite.associate = ({ Account, Enterprise, User }) => {
    Invite.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Invite.belongsTo(Enterprise, {
      foreignKey: 'enterpriseId',
      as: 'enterprise',
    });

    Invite.belongsTo(User, {
      foreignKey: 'sendingUserId',
      as: 'sendingUser',
    });
  };

  return Invite;
}
