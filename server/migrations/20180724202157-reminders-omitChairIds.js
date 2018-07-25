'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Reminders',
      'omitChairIds',
      {
        type: Sequelize.ARRAY(Sequelize.UUID),
        allowNull: false,
        defaultValue: [],
      },
    );
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'Reminders',
      'omitChairIds',
    );
  }
};
