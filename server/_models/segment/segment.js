module.exports = (sequelize, DataTypes) => {
  const Segment = sequelize.define('Segment', {
    segmentId: {
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
  });

  Segment.associate = ((models) => {
    Segment.hasMany(models.SegmentItem, {
      foreignKey: 'segmentId',
      as: 'SegmentItem',
    });
  });


  return Segment;
};
