'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'SentRecalls',
          'isHygiene',
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
          'SentRecalls',
          'isHygiene',
          { transaction: t },
        );
      } catch (e) {
        console.error(e);
        return t.rollback();
      }
    });
  },
};
