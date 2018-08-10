'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn('Requests', 'patientId', {
          type: Sequelize.UUID,
          references: {
            model: 'Patients',
            key: 'id',
          },
        }, { transaction: t });
      } catch (err) {
        console.log(err);
        return t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Requests',
          'patientId',
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
