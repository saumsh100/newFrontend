export default function (sequelize, DataTypes) {
  const AppointmentCode = sequelize.define('AppointmentCode', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    appointmentId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    code: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  AppointmentCode.associate = (models) => {
    const {
      Appointment,
    } = models;

    AppointmentCode.belongsTo(Appointment, {
      foreignKey: 'appointmentId',
      as: 'appointment',
    });
  };

  return AppointmentCode;
}
