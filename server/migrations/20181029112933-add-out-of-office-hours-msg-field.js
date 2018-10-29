
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      try {
        await queryInterface.addColumn(
          'Accounts',
          'autoRespondOutsideOfficeHours',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction },
        );
      } catch (err) {
        console.error(err);
        transaction.rollback();
      }
    });
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      try {
        await queryInterface.removeColumn(
          'Accounts',
          'autoRespondOutsideOfficeHours',
          { transaction },
        );
      } catch (err) {
        console.error(err);
        transaction.rollback();
      }
    });
  },
};
