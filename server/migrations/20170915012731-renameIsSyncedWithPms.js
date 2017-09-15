'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {

    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.renameColumn('Appointments', 'isSyncedWithPMS', 'isSyncedWithPms');
        await queryInterface.renameColumn('Patients', 'isSyncedWithPMS', 'isSyncedWithPms');
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {

    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.renameColumn('Appointments', 'isSyncedWithPms', 'isSyncedWithPMS');
        await queryInterface.renameColumn('Patients', 'isSyncedWithPms', 'isSyncedWithPMS');
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },
};
