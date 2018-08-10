'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Appointments',
      'isPending',
      {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
        allowNull: false,
      },
    );
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(
      'Appointments',
      'isPending',
    );
  },
};
