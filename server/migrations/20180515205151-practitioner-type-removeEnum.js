'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.changeColumn(
          'Practitioners',
          'type',
          {
            type: Sequelize.STRING,
            allowNull: true,
            defaultValue: null,
          },
          { transaction: t },
        );

        await queryInterface.sequelize.query(
          `DROP TYPE IF EXISTS "enum_Practitioners_type";`,
          { transaction: t },
        );
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    // There is no down function cause its too hard to implement
    // with setting defaultValue
  },
};
