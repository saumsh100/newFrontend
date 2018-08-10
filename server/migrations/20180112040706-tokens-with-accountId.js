'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        queryInterface.addColumn(
          'PatientUserResets',
          'accountId',
          {
            type: Sequelize.UUID,
          },
          { transaction: t },
        );

        queryInterface.addColumn(
          'Tokens',
          'accountId',
          {
            type: Sequelize.UUID,
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
          'PatientUserResets',
          'accountId',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'Tokens',
          'accountId',
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
