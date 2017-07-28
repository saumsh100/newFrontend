
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
  });

  Token.associate = ({ Appointment, PatientUser }) => {
    Token.belongsTo(Appointment, {
      foreignKey: 'appointmentId',
      as: 'appointment',
    });

    PatientUser.belongsTo(PatientUser, {
      foreignKey: 'patientUserId',
      as: 'patientUser',
    });
  };

  return Token;
}
