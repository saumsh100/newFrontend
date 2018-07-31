'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'WaitSpots',
          'reasonId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'Services',
              key: 'id',
            },
            onUpdate: 'cascade',
          },
          { transaction: t },
        );
        await queryInterface.addColumn(
          'WaitSpots',
          'practitionerId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'Practitioners',
              key: 'id',
            },
            onUpdate: 'cascade',
          },
          { transaction: t },
        );
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },

  down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn('WaitSpots', 'reasonId', { transaction: t });
        await queryInterface.removeColumn('WaitSpots', 'practitionerId', { transaction: t });
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
