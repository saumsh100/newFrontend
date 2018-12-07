'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      try {
        await queryInterface.addColumn(
          'PatientSearches',
          'context',
          {
            type: Sequelize.STRING,
            defaultValue: 'topBar',
          },
          { transaction },
        );
      } catch (err) {
        console.error(err);
        transaction.rollback();
      }
    });
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      try {
        await queryInterface.removeColumn(
          'PatientSearches',
          'context',
          { transaction },
        );
      } catch (err) {
        console.error(err);
        transaction.rollback();
      }
    });
  },
};
