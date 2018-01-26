
export default function (sequelize, DataTypes) {
  const Token = sequelize.define('Token', {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },

    appointmentId: {
      type: DataTypes.UUID,
    },

    patientUserId: {
      type: DataTypes.UUID,
    },

    accountId: {
      type: DataTypes.UUID,
    },
  });

  Token.associate = ({ Account, Appointment, PatientUser }) => {
    Token.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Token.belongsTo(Appointment, {
      foreignKey: 'appointmentId',
      as: 'appointment',
    });

    Token.belongsTo(PatientUser, {
      foreignKey: 'patientUserId',
      as: 'patientUser',
    });
  };

  return Token;
}
