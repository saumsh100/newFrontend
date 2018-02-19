'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Patients',
          'avatarUrl',
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

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Patients',
          'avatarUrl',
          { transaction: t }
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  }
};
