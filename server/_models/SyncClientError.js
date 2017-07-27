
const OPERATIONS = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
  SYNC: 'sync',
};

export default function (sequelize, DataTypes) {
  const SyncClientError = sequelize.define('SyncClientError', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    syncId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    version: {
      type: DataTypes.STRING,
    },

    adapter: {
      type: DataTypes.STRING,
    },

    operation: {
      type: DataTypes.ENUM,
      values: Object.keys(OPERATIONS).map(key => OPERATIONS[key]),
      // TODO: maybe a default value?
      allowNull: false,
    },

    success: {
      type: DataTypes.BOOLEAN,
    },

    model: {
      type: DataTypes.STRING,
    },

    documentId: {
      type: DataTypes.STRING,
    },

    payload: {
      type: DataTypes.STRING,
    },

    customErrorMsg: {
      type: DataTypes.STRING,
    },

    errorMessage: {
      type: DataTypes.STRING,
    },

    stackTrace: {
      type: DataTypes.STRING,
    },
  });

  SyncClientError.associate = ({ Account }) => {
    SyncClientError.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });
  };

  return SyncClientError;
}
