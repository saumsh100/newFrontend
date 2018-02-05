'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        // Now change current Recalls lengthSeconds to be 1week post-dueDate (-604800 seconds)
        await queryInterface.sequelize.query(
          'UPDATE "Recalls" ' +
          'SET "deletedAt" = current_timestamp ' +
          'WHERE "interval" is null AND "deletedAt" is null;'
        , { transaction: t });

        // Now change current Reminders lengthSeconds to be 1week post-dueDate (-604800 seconds)
        await queryInterface.sequelize.query(
          'UPDATE "Reminders" ' +
          'SET "deletedAt" = current_timestamp ' +
          'WHERE "interval" is null AND "deletedAt" is null;'
          , { transaction: t });
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {

  }
};
