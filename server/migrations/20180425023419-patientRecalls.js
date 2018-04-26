'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('PatientRecalls', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: Sequelize.UUID,
        references: {
          model: 'Accounts',
          key: 'id',
        },
        allowNull: false,
      },

      patientId: {
        type: Sequelize.UUID,
        references: {
          model: 'Patients',
          key: 'id',
        },
        allowNull: false,
      },

      pmsId: {
        type: Sequelize.STRING,
      },

      dueDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      type: {
        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      deletedAt: {
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable('PatientRecalls');
  },
};
