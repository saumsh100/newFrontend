'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Patients',
          'recallPendingAppointmentId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'Appointments',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'set null',
          },
          { transaction: t }
        );

        await queryInterface.addColumn(
          'Patients',
          'hygienePendingAppointmentId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'Appointments',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'set null',
          },
          { transaction: t }
        );
      } catch (err) {
        console.log(err);
        return t.rollback();
      }
    });
  },

  down: function (queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn('Patients', 'recallPendingAppointmentId', { transaction: t });
        await queryInterface.removeColumn('Patients', 'hygienePendingAppointmentId', { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  }
};
