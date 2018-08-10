'use strict';

module.exports = {
  up: async function (queryInterface, DataTypes) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    await queryInterface.createTable('PatientUserResets', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      patientUserId: {
        type: DataTypes.UUID,
        references: {
          model: 'PatientUsers',
          key: 'id',
        },
        onUpdate: 'cascade',
      },

      token: {
        type: DataTypes.STRING,
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
    await queryInterface.dropTable('PatientUserResets');
  },
};
