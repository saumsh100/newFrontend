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
        queryInterface.addColumn(
          'SentReminders',
          'errorCode',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        );

        queryInterface.addColumn(
          'SentRecalls',
          'errorCode',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        );

        queryInterface.addColumn(
          'SentReviews',
          'errorCode',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        );
      } catch (err) {
        console.log(err);
        t.rollback();
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
        await queryInterface.removeColumn(
          'SentReminders',
          'errorCode',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'SentRecalls',
          'errorCode',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'SentReviews',
          'errorCode',
          { transaction: t },
        );
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },
};
