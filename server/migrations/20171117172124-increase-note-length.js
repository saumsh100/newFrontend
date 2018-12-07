'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Correspondences',
      'note',
      {
        type: Sequelize.STRING(511),
      },
    );
  },

  down: function (queryInterface, Sequelize) {
    return Promise.resolve();
  },
};
