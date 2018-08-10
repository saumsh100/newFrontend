'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Reminders',
          'dontSendWhenClosed',
          {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
          },
          { transaction: t },
        );
      } catch (e) {
        console.error(e);
        return t.rollback();
      }
    });
  },

  down: function (queryInterface, DataTypes) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Reminders',
          'dontSendWhenClosed',
          { transaction: t },
        );
      } catch (e) {
        console.error(e);
        return t.rollback();
      }
    });
  },
};
