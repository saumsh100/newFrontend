module.exports = (sequelize, DataTypes) => {
  const SegmentItem = sequelize.define('SegmentItem', {
    segmentItemId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    // to be added
  });

  // Create association
  SegmentItem.associate = ((models) => {
    SegmentItem.belongsTo(models.Segment, {
      foreignKey: 'segmentId',
      as: 'Segment',
    });
  });


  return SegmentItem;
};
