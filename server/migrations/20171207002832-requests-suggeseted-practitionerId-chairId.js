'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Requests',
          'suggestedPractitionerId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'Practitioners',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'set null',
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Requests',
          'suggestedChairId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'Chairs',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'set null',
          },
          { transaction: t },
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
          'Requests',
          'suggestedChairId',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'Requests',
          'suggestedPractitionerId',
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
