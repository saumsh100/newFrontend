'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(
      'Appointments',
      'isMissed',
      {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    );
  },

  down: (queryInterface) => {
    return queryInterface.removeColumn(
      'Appointments',
      'isMissed',
    );
  },
};
