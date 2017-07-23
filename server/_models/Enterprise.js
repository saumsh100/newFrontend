
const GROWTH = 'GROWTH';
const ENTERPRISE = 'ENTERPRISE';

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
      type: DataTypes.ENUM(
        GROWTH,
        ENTERPRISE
      ),

      defaultValue: GROWTH,
      allowNull: false,
    },
  });

  return Enterprise;
}
