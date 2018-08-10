'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Accounts',
          'reviewsInterval',
          {
            type: Sequelize.STRING,
            defaultValue: '15 minutes',
          },
          { transaction: t },
        );
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Accounts',
          'reviewsInterval',
          { transaction: t },
        );
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },
};
