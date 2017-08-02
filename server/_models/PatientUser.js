
import bcrypt from 'bcrypt';
import { passwordHashSaltRounds } from '../config/globals';
import customDataTypes from '../util/customDataTypes';

export default function (sequelize, DataTypes) {
  const PatientUser = sequelize.define('PatientUser', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    phoneNumber: customDataTypes.phoneNumber('phoneNumber', DataTypes, {
      allowNull: false,
      unique: true,
    }),

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    isEmailConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    isPhoneNumberConfirmed: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },

    avatarUrl: {
      type: DataTypes.STRING,
    },
  });


  PatientUser.associate = (({ Patient }) => {
    // TODO: add waitspots and requests once those models are done

    PatientUser.hasMany(Patient, {
      foreignKey: 'patientUserId',
      as: 'patients',
    });
  });

  return PatientUser;
}
