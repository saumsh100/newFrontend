'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Appointments',
          'originalDate',
          { type: Sequelize.DATE },
          { transaction: t },
        );
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Appointments',
          'originalDate',
          { transaction: t }
        );
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },
};
