
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      try {
        await queryInterface.removeColumn(
          'Accounts',
          'autoRespondOutsideOfficeHours',
          { transaction },
        );

        await queryInterface.addColumn(
          'Accounts',
          'canAutoRespondOutsideOfficeHours',
          {
            type: Sequelize.BOOLEAN,
            defaultValue: false,
          },
          { transaction },
        );

        await queryInterface.addColumn(
          'Accounts',
          'bufferBeforeOpening',
          {
            type: Sequelize.STRING,
            allowNull: true,
          },
          { transaction },
        );

        await queryInterface.addColumn(
          'Accounts',
          'bufferAfterClosing',
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

  async down(queryInterface, Sequelize) {
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

        await queryInterface.removeColumn(
          'Accounts',
          'bufferBeforeOpening',
          { transaction },
        );

        await queryInterface.removeColumn(
          'Accounts',
          'bufferAfterClosing',
          { transaction },
        );
      } catch (err) {
        console.error(err);
        transaction.rollback();
      }
    });
  },
};

