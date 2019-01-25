'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Accounts',
      'isChairSchedulingEnabled',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    );
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'Accounts',
      'isChairSchedulingEnabled',
    );
  },
};
