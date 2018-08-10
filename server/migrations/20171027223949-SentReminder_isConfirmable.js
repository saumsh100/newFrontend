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
          'isConfirmable',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: true,
            allowNull: false,
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
          'isConfirmable',
          { transaction: t },
        );
      } catch (err) {
        console.error(e);
        t.rollback();
      }
    });
  },
};
