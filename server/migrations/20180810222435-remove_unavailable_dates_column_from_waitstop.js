'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'WaitSpots',
          'unavailableDates',
          { transaction: t },
        );
        await queryInterface.changeColumn(
          'WaitSpots',
          'availableDates',
          {
            type: Sequelize.ARRAY(Sequelize.STRING),
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
        await queryInterface.addColumn(
          'WaitSpots',
          'unavailableDates',
          {
            type: Sequelize.ARRAY(Sequelize.DATE),
          },
          { transaction: t },
        );
        await queryInterface.changeColumn(
          'WaitSpots',
          'availableDates',
          {
            type: Sequelize.ARRAY(Sequelize.DATEONLY),
          },
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
