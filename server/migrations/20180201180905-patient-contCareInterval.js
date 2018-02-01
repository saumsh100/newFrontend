'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Patients',
          'contCareInterval',
          {
            type: Sequelize.STRING,
          },
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'Patients',
          'recareDueDateSeconds',
          { transaction: t }
        );

        await queryInterface.removeColumn(
          'Patients',
          'hygieneDueDateSeconds',
          { transaction: t }
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
          'contCareInterval',
          { transaction: t }
        );

        await queryInterface.addColumn(
          'Patients',
          'recareDueDateSeconds',
          {
            type: Sequelize.INTEGER,
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Patients',
          'hygieneDueDateSeconds',
          {
            type: Sequelize.INTEGER,
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
