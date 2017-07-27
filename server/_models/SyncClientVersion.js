
export default function (sequelize, DataTypes) {
  const SyncClientVersion = sequelize.define('SyncClientVersion', {
    id: {
      // TODO: why not use type UUIDV4
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    major: {
      type: DataTypes.FLOAT,
    },

    minor: {
      type: DataTypes.FLOAT,
    },

    patch: {
      type: DataTypes.FLOAT,
    },

    build: {
      type: DataTypes.FLOAT,
    },

    url: {
      type: DataTypes.STRING,
    },

    key: {
      type: DataTypes.STRING,
    },

    secret: {
      type: DataTypes.STRING,
    },

    filename: {
      type: DataTypes.STRING,
    },

    path: {
      type: DataTypes.STRING,
    },

    bucket: {
      type: DataTypes.STRING,
    },
  });

  return SyncClientVersion;
}
