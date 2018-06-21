
'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'WaitSpots',
          'unavailableDates',
          {
            type: Sequelize.ARRAY(Sequelize.DATEONLY),
          },
          { transaction: t },
        );
        await queryInterface.addColumn(
          'WaitSpots',
          'availableDates',
          {
            type: Sequelize.ARRAY(Sequelize.DATEONLY),
          },
          { transaction: t },
        );
        await queryInterface.addColumn(
          'WaitSpots',
          'availableTimes',
          {
            type: Sequelize.ARRAY(Sequelize.DATEONLY),
          },
          { transaction: t },
        );
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },

  down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn('WaitSpots', 'unavailableDates', { transaction: t });
        await queryInterface.removeColumn('WaitSpots', 'availableDates', { transaction: t });
        await queryInterface.removeColumn('WaitSpots', 'availableTimes', { transaction: t });
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
