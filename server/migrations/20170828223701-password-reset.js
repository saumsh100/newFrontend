'use strict';

module.exports = {
  up: async function (queryInterface, DataTypes) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    await queryInterface.createTable('PasswordResets', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: true,
        },

        allowNull: false,
      },

      token: {
        type: DataTypes.UUID,
      },

      createdAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: DataTypes.DATE,
      },

      deletedAt: {
        type: DataTypes.DATE,
      },
    });
  },

  down: async function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    await queryInterface.dropTable('PasswordResets');
  },
};
