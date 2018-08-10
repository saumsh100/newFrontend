'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Practitioners',
      'firstName',
      {
        type: Sequelize.STRING,
        allowNull: true,
      },
    );
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.changeColumn(
      'Practitioners',
      'firstName',
      {
        type: Sequelize.STRING,
        allowNull: false,
      },
    );
  },
};
