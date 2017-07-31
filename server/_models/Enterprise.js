const PLAN = {
  GROWTH: 'GROWTH',
  ENTERPRISE: 'ENTERPRISE',
};

export default function (sequelize, DataTypes) {
  const Enterprise = sequelize.define('Enterprise', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    // We should probably make the name unique as well later on...
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    plan: {
      type: DataTypes.ENUM,
      values: Object.keys(PLAN).map(key => PLAN[key]),
      defaultValue: PLAN.GROWTH,
      allowNull: false,
    },
  });

  Enterprise.associate = (({ Account }) => {
    Enterprise.hasMany(Account);
  });

  Enterprise.PLAN = PLAN;

  return Enterprise;
}
