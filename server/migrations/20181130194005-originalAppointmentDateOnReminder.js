
'use strict';

module.exports = {
  up: (queryInterface, DataTypes) =>
    queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'SentRemindersPatients',
        'appointmentStartDate',
        { type: DataTypes.DATE },
        { transaction: t },
      );
    }),

  down: queryInterface =>
    queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn(
        'SentRemindersPatients',
        'appointmentStartDate',
        { transaction: t },
      );
    }),
};
