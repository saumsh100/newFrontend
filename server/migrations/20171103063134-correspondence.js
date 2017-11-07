'use strict';

/**
 * Migration to create Correspondence Schema
 * @type {{up: ((queryInterface, Sequelize)=>Promise), down: ((queryInterface, Sequelize)=>Promise)}}
 */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Correspondences', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      pmsId: {
        type: Sequelize.STRING,
      },

      accountId: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      patientId: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      appointmentId: {
        type: Sequelize.UUID,
        allowNull: true,
      },

      type: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      pmsType: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      note: {
        type: Sequelize.STRING,
        allowNull: true,
      },

      contactedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },

      isSyncedWithPms: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Correspondences');
  },
};
