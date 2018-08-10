'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return queryInterface.addColumn(
      'WaitSpots',
      'daysOfTheWeek',
      {
        type: Sequelize.JSONB,
        allowNull: true,
      },
    );
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */

    return queryInterface.removeColumn(
      'WaitSpots',
      'daysOfTheWeek',
    );
  },
};
