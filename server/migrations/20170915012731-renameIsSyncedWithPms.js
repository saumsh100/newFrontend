'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.renameColumn('Appointments', 'isSyncedWithPms', 'isSyncedWithPms');
        await queryInterface.renameColumn('Patients', 'isSyncedWithPms', 'isSyncedWithPms');
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.renameColumn('Appointments', 'isSyncedWithPms', 'isSyncedWithPms');
        await queryInterface.renameColumn('Patients', 'isSyncedWithPms', 'isSyncedWithPms');
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },
};
