'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
      return queryInterface.sequelize.transaction(async (t) => {
        try {
            await queryInterface.addColumn(
              'Appointments',
              'reason',
              {
                  type: Sequelize.STRING,
              },
              { transaction: t },
            );

            await queryInterface.addColumn(
              'Appointments',
              'isPreConfirmed',
              {
                type: Sequelize.BOOLEAN,
              },
              { transaction: t },
            );

            await queryInterface.addColumn(
              'Appointments',
              'estimatedRevenue',
              {
                type: Sequelize.FLOAT,
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
              'Appointments',
              'reason',
              {
                  type: Sequelize.STRING,
              },
              { transaction: t },
            );

            await queryInterface.removeColumn(
              'Appointments',
              'isPreConfirmed',
              {
                type: Sequelize.BOOLEAN,
              },
              { transaction: t },
            );

            await queryInterface.removeColumn(
              'Appointments',
              'estimatedRevenue',
              {
                type: Sequelize.FLOAT,
              },
              { transaction: t },
            );
        } catch (err) {
            console.log(err);
            t.rollback();
        }
      });
  },
};
