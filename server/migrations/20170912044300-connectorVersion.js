'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {
    await queryInterface.createTable('ConnectorVersions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      tag: {
        type: Sequelize.STRING,
        uniqueKey: true,
      },

      url: {
        type: Sequelize.STRING,
      },

      key: {
        type: Sequelize.STRING,
      },

      secret: {
        type: Sequelize.STRING,
      },

      filename: {
        type: Sequelize.STRING,
      },

      path: {
        type: Sequelize.STRING,
      },

      bucket: {
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

  down: async function (queryInterface, Sequelize) {
    await queryInterface.dropTable('ConnectorVersions');
  },
};
