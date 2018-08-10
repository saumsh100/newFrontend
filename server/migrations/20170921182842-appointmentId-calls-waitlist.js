'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'WaitSpots',
          'appointmentId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'Appointments',
              key: 'id',
            },
            onUpdate: 'cascade',
          },
          { transaction: t },
        );

        await queryInterface.addColumn(
          'Calls',
          'appointmentId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'Appointments',
              key: 'id',
            },
            onUpdate: 'cascade',
          },
          { transaction: t },
        );
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'WaitSpots',
          'appointmentId',
          { transaction: t },
        );

        await queryInterface.removeColumn(
          'Calls',
          'appointmentId',
          { transaction: t },
        );
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },
};
