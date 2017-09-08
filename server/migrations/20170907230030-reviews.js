'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.createTable('Reviews', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },

          accountId: {
            type: Sequelize.UUID,
            allowNull: false,
          },

          patientId: {
            type: Sequelize.UUID,
          },

          patientUserId: {
            type: Sequelize.UUID,
          },

          stars: {
            type: Sequelize.INTEGER,
            allowNull: false,
            validate: {
              min: 1,
              max: 5,
            },
          },

          description: {
            type: Sequelize.TEXT,
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
        },{ transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.dropTable('Reviews', { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  }
};
