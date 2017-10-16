/**
 * Created by gavin on 2017-09-11.
 */

export default function (sequelize, DataTypes) {
  const ConnectorVersion = sequelize.define('ConnectorVersion', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    tag: {
      type: DataTypes.STRING,
      uniqueKey: true,
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

  return ConnectorVersion;
}
