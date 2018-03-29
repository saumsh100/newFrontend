'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addIndex('Appointments', ['startDate']);
        await queryInterface.addIndex('Appointments', ['endDate']);
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeIndex('Appointments', ['startDate']);
        await queryInterface.removeIndex('Appointments', ['endDate']);
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },
};
