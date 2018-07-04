'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.changeColumn(
          'WaitSpots',
          'availableTimes',
          {
            type: Sequelize.ARRAY(Sequelize.DATE),
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
        await queryInterface.changeColumn(
          'WaitSpots',
          'availableTimes',
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
