
export default function (sequelize, DataTypes) {
  const Account = sequelize.define('Account', {
    id: {
      // TODO: why not use type UUIDV4
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    enterpriseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    weeklyScheduleId: {
      type: DataTypes.UUID,
    },

    canSendReminders: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    canSendRecalls: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },

    unit: {
      type: DataTypes.INTEGER,
      defaultValue: 15,
    },

    street: {
      type: DataTypes.STRING,
    },

    country: {
      type: DataTypes.STRING,
    },

    state: {
      type: DataTypes.STRING,
    },

    city: {
      type: DataTypes.STRING,
    },

    zipCode: {
      type: DataTypes.STRING,
    },

    vendastaId: {
      type: DataTypes.STRING,
    },

    timeInterval: {
      type: DataTypes.INTEGER,
    },

    twilioPhoneNumber: {
      type: DataTypes.STRING,
    },

    destinationPhoneNumber: {
      type: DataTypes.STRING,
    },

    phoneNumber: {
      type: DataTypes.STRING,
    },

    contactEmail: {
      type: DataTypes.STRING,
    },

    website: {
      type: DataTypes.STRING,
    },

    logo: {
      type: DataTypes.STRING,
    },

    clinicName: {
      type: DataTypes.STRING,
    },

    bookingWidgetPrimaryColor: {
      type: DataTypes.STRING,
    },
  });

  Account.associate = (({ Enterprise, Patient }) => {
    Account.belongsTo(Enterprise);
    Account.hasMany(Patient);
  });

  return Account;
}
