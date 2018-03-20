'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Correspondences',
      'note',
      {
        type: Sequelize.STRING(3000),
      }
    );
  },

  down: function (queryInterface, Sequelize) {
  }
};