'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn('Patients', 'lastHygieneApptId', {
          type: Sequelize.UUID,
          references: {
            model: 'Appointments',
            key: 'id',
          },
          onUpdate: 'cascade',
          onDelete: 'set null',
        }, { transaction: t });

        await queryInterface.addColumn('Patients', 'lastHygieneDate', {
          type: Sequelize.DATE,
        }, { transaction: t });

      } catch (err) {
        console.log(err);
        return t.rollback();
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn('Patients', 'lastHygieneDate', { transaction: t });
        await queryInterface.removeColumn('Patients', 'lastHygieneApptId', { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  },
};
