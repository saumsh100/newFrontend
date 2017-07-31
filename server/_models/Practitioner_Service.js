
export default function (sequelize, DataTypes) {
  const Practitioner_Service = sequelize.define('Practitioner_Service', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    practitionerId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    serviceId: {
      type: DataTypes.UUID,
      allowNull: false,
    },
  });

  return Practitioner_Service;
}
