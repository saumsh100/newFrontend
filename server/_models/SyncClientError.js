
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
      type: DataTypes.BIGINT,
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
      type: DataTypes.TEXT('long'),
    },

    customErrorMsg: {
      type: DataTypes.TEXT('long'),
    },

    errorMessage: {
      type: DataTypes.TEXT('long'),
    },

    stackTrace: {
      type: DataTypes.TEXT('long'),
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
