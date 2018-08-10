'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Correspondences',
          'sentReviewId',
          {
            type: Sequelize.UUID,
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
          'Correspondences',
          'sentReviewId',
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
