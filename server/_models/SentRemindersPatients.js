
'use strict';

export default function (sequelize, DataTypes) {
  const SentRemindersPatients = sequelize.define('SentRemindersPatients', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    sentRemindersId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    patientId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    appointmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });


  SentRemindersPatients.associate = ({ SentReminder, Appointment, Patient }) => {
    SentRemindersPatients.belongsTo(SentReminder, {
      foreignKey: 'sentRemindersId',
      as: 'sentReminder',
      targetKey: 'id',
    });

    SentRemindersPatients.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });

    SentRemindersPatients.belongsTo(Appointment, {
      foreignKey: 'appointmentId',
      as: 'appointment',
    });
  };

  return SentRemindersPatients;
}
