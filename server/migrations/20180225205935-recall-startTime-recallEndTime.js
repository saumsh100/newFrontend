'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Accounts',
          'recallStartTime',
          {
            type: Sequelize.TIME,
            defaultValue: '17:00:00',
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Accounts',
          'recallEndTime',
          {
            type: Sequelize.TIME,
            defaultValue: '20:00:00',
          },
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
          'Accounts',
          'recallStartTime',
          { transaction: t },
        );
        await queryInterface.removeColumn(
          'Accounts',
          'recallEndTime',
          { transaction: t },
        );
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },
};
