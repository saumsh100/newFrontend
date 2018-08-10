'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Requests',
          'insuranceCarrier',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Requests',
          'insuranceMemberId',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        );
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },

  down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Requests',
          'insuranceCarrier',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'Requests',
          'insuranceMemberId',
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
