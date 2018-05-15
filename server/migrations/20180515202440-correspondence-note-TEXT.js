'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Correspondences',
      'note',
      {
        type: Sequelize.TEXT,
      }
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Correspondences',
      'note',
      {
        type: Sequelize.STRING(3000),
      }
    );
  }
};
