
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

    codeType: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'CDA',
    },

    isValidated: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  Procedure.associate = (({ DeliveredProcedure }) => {
    Procedure.hasMany(DeliveredProcedure, {
      foreignKey: 'procedureCodeId',
      sourceKey: 'code',
      as: 'deliveredProcedures',
    });
  });

  return Procedure;
}
