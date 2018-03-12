
import bcrypt from 'bcrypt';
import { passwordHashSaltRounds } from '../config/globals';

export default function (sequelize, DataTypes) {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    username: {
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

    activeAccountId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    enterpriseId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    permissionId: {
      type: DataTypes.UUID,
      allowNull: false,
    },

    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },

    avatarUrl: {
      type: DataTypes.STRING,
    },

    sendBookingRequestEmail: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false,
    },
  });

  User.associate = ({ Account, Enterprise, Permission }) => {
    User.belongsTo(Account, {
      foreignKey: 'activeAccountId',
      as: 'activeAccount',
    });

    User.belongsTo(Enterprise, {
      foreignKey: 'enterpriseId',
      as: 'enterprise',
    });

    User.belongsTo(Permission, {
      foreignKey: 'permissionId',
      as: 'permission',
    });
  };

  /**
   * isValidPasswordAsync is used to ensure the password is correct
   *
   * @param password
   * @returns {Promise}
   */
  User.prototype.isValidPasswordAsync = function (password) {
    return new Promise((resolve, reject) => {
      bcrypt.compare(password, this.password, (err, match) => {
        if (err) reject(err);
        if (!match) reject(new Error('Invalid password'));
        return resolve(true);
      });
    });
  };

  /**
   * setPasswordAsync is used to set password attr on user model
   *
   * @param password
   * @returns {Promise}
   */
  User.prototype.setPasswordAsync = function (password) {
    return new Promise((resolve, reject) => {
      bcrypt.hash(password, passwordHashSaltRounds, (err, hashedPassword) => {
        if (err) reject(err);
        this.password = hashedPassword;
        return resolve(this);
      });
    });
  };

  return User;
}
