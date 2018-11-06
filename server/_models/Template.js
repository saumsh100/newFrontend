
export default function (sequelize, DataTypes) {
  const Template = sequelize.define('Template', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    templateName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    values: {
      type: DataTypes.JSONB,
      allowNull: false,
    },
  });

  return Template;
}
