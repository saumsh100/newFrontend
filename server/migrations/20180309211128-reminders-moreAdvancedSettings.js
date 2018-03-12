'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Reminders',
          'isDaily',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Reminders',
          'dailyRunTime',
          {
            type: Sequelize.TIME,
            allowNull: true,
          },
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },

  down: function (queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Reminders',
          'isDaily',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'Reminders',
          'dailyRunTime',
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  }
};
