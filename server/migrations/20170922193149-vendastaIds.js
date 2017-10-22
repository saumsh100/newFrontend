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
        await queryInterface.addColumn(
          'Accounts',
          'vendastaMsId',
          {
            type: Sequelize.STRING,
          },
          { transaction: t }
        );

        await queryInterface.addColumn(
          'Accounts',
          'vendastaSrId',
          {
            type: Sequelize.STRING,
          },
          { transaction: t }
        );

      } catch (e) {
        console.log(e);
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
          'Accounts',
          'vendastaMsId',
          { transaction: t }
        );

        await queryInterface.removeColumn(
          'Accounts',
          'vendastaSrId',
          { transaction: t }
        );

      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  }
};
