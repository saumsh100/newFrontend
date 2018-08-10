'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Requests',
          'sentRecallId',
          {
            type: DataTypes.STRING,
          },
          { transaction: t },
        );
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  },

  down: function (queryInterface, DataTypes) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Requests',
          'sentRecallId',
          { transaction: t },
        );
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  },
};
