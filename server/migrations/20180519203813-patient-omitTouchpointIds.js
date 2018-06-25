'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Patients',
          'omitReminderIds',
          {
            type: Sequelize.ARRAY(Sequelize.UUID),
            allowNull: false,
            defaultValue: [],
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Patients',
          'omitRecallIds',
          {
            type: Sequelize.ARRAY(Sequelize.UUID),
            allowNull: false,
            defaultValue: [],
          },
          { transaction: t },
        );
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },

  down: function (queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Patients',
          'omitReminderIds',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'Patients',
          'omitRecallIds',
          { transaction: t },
        );
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  }
};
