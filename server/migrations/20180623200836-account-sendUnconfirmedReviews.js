'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Accounts',
      'sendUnconfirmedReviews',
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
      'sendUnconfirmedReviews',
    );
  }
};
