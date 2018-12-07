'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'TextMessages',
      'body',
      {
        type: Sequelize.TEXT,
      },
    );
  },

  down: function (queryInterface, Sequelize) {
    return Promise.resolve();
  },
};
