'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Accounts',
          'autoRespondOutsideOfficeHoursLimit',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'TextMessages',
          'isOutsideOfficeHoursRespond',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },

  down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Accounts',
          'autoRespondOutsideOfficeHoursLimit',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'TextMessages',
          'isOutsideOfficeHoursRespond',
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
