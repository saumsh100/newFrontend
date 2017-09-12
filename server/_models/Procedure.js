
export default function (sequelize, DataTypes) {
  const Procedure = sequelize.define('Procedure', {
    code: {
      type: DataTypes.STRING,
      primaryKey: true,
    },

    type: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    description: {
      type: DataTypes.STRING,
    },
  });

  Procedure.associate = (({ }) => {

  });

  return Procedure;
}
