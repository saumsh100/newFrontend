
export default function (sequelize, DataTypes) {
  const DeliveredProcedure = sequelize.define('DeliveredProcedure', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    procedureCode: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    pmsId: {
      type: DataTypes.STRING,
    },

    units: {
      type: DataTypes.FLOAT,
    },

    totalAmount: {
      type: DataTypes.FLOAT,
    },

    primaryInsuranceAmount: {
      type: DataTypes.FLOAT,
    },

    secondaryInsuranceAmount: {
      type: DataTypes.FLOAT,
    },

    patientAmount: {
      type: DataTypes.FLOAT,
    },

    discountAmount: {
      type: DataTypes.FLOAT,
    },
  });

  DeliveredProcedure.associate = (({ Account, Patient, Procedure }) => {
    DeliveredProcedure.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    DeliveredProcedure.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });

    DeliveredProcedure.belongsTo(Procedure, {
      foreignKey: 'procedureCode',
      as: 'procedure',
    });
  });

  return DeliveredProcedure;
}
