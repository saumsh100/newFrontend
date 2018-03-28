
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

    patientUserFamilyId: {
      type: DataTypes.UUID,
    },

    email: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true,
      },
    },

    password: {
      type: DataTypes.STRING,
    },

    phoneNumber: customDataTypes.phoneNumber('phoneNumber', DataTypes, {
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

    gender: {
      type: DataTypes.STRING,
    },

    birthDate: {
      type: DataTypes.DATE,
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


  PatientUser.associate = (({ Patient, PatientUserFamily, Request, WaitSpot }) => {
    PatientUser.hasMany(Patient, {
      foreignKey: 'patientUserId',
      as: 'patients',
    });

    PatientUser.belongsTo(PatientUserFamily, {
      foreignKey: 'patientUserFamilyId',
      as: 'patientUserFamily',
    });

    PatientUser.hasMany(Request, {
      foreignKey: 'patientUserId',
      as: 'requests',
    });

    PatientUser.hasMany(WaitSpot, {
      foreignKey: 'patientUserId',
      as: 'waitSpots',
    });
  });

  /**
   * setPasswordAsync is used to set password attr on PatientUser model
   *
   * @param password
   * @returns {Promise}
   */
  PatientUser.prototype.setPasswordAsync = function (password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, passwordHashSaltRounds, (err, hashedPassword) => {
        if (err) reject(err);
        this.password = hashedPassword;
        return resolve(this);
      });
    });
  };

  return PatientUser;
}
