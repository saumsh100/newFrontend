'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Reminders',
          'isCustomConfirm',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: false,
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Reminders',
          'customConfirmData',
          {
            type: Sequelize.JSON,
            allowNull: true,
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Reminders',
          'isConfirmable',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
            defaultValue: true,
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Reminders',
          'omitPractitionerIds',
          {
            type: Sequelize.ARRAY(Sequelize.UUID),
            allowNull: false,
            defaultValue: [],
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Reminders',
          'ignoreSendIfConfirmed',
          {
            type: Sequelize.BOOLEAN,
            allowNull: false,
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

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Reminders',
          'isCustomConfirm',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'Reminders',
          'customConfirmData',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'Reminders',
          'isConfirmable',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'Reminders',
          'omitPractitionerIds',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'Reminders',
          'ignoreSendIfConfirmed',
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
