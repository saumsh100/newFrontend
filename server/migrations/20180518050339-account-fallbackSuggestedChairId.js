'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.addColumn(
      'Accounts',
      'suggestedChairId',
      {
        type: Sequelize.UUID,
        references: {
          model: 'Chairs',
          key: 'id',
        },
      },
    );
  },

  down: function (queryInterface) {
    return queryInterface.removeColumn(
      'Accounts',
      'suggestedChairId',
    );
  },
};
