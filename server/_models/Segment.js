module.exports = (sequelize, DataTypes) => {
  // @TODO Add additional modules for which segment will be available on the enterprise dashboard
  const MODULES = {
    PATIENTS: 'patients',
  };

  const Segment = sequelize.define('Segment', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: [8, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
      validate: {
        isUUID: 4,
      },
    },
    module: {
      type: DataTypes.ENUM,
      values: Object.keys(MODULES).map(key => MODULES[key]),
    },
    where: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  });

  // Allowing constant to be available for usage outside of model
  Segment.MODULES = MODULES;

  return Segment;
};
