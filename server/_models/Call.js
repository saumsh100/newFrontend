
import customDataTypes from '../util/customDataTypes';

export default function (sequelize, DataTypes) {
  const Call = sequelize.define('Call', {
    id: {
      //  CallRail ID
      type: DataTypes.STRING,
      primaryKey: true,
    },

    accountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    patientId: {
      type: DataTypes.UUID,
    },

    answered: {
      type: DataTypes.BOOLEAN,
    },

    voicemail: {
      type: DataTypes.BOOLEAN,
    },

    wasApptBooked: {
      type: DataTypes.BOOLEAN,
    },

    direction: {
      type: DataTypes.STRING,
    },

    duration: {
      type: DataTypes.INTEGER,
    },

    priorCalls: {
      type: DataTypes.INTEGER,
    },

    recording: {
      type: DataTypes.STRING,
    },

    recordingDuration: {
      type: DataTypes.STRING,
    },

    startTime: {
      type: DataTypes.DATE,
    },

    totalCalls: {
      type: DataTypes.INTEGER,
    },

    callerCity: {
      type: DataTypes.STRING,
    },

    callerCountry: {
      type: DataTypes.STRING,
    },

    callerName: {
      type: DataTypes.STRING,
    },

    callerNum: {
      type: DataTypes.STRING,
    },

    callerZip: {
      type: DataTypes.STRING,
    },

    callerState: {
      type: DataTypes.STRING,
    },

    campaign: {
      type: DataTypes.STRING,
    },

    destinationNum: customDataTypes.phoneNumber('destinationNum', DataTypes),
    trackingNum: customDataTypes.phoneNumber('trackingNum', DataTypes),

    callSource: {
      // TODO: should this be an ENUM?
      type: DataTypes.STRING,
    },
  });

  Call.associate = ({ Account, Patient }) => {
    Call.belongsTo(Account, {
      foreignKey: 'accountId',
      as: 'account',
    });

    Call.belongsTo(Patient, {
      foreignKey: 'patientId',
      as: 'patient',
    });
  };

  return Call;
}
