'use strict';

module.exports = {
  up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Requests',
          'requestingPatientUserId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'PatientUsers',
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

  down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn(
          'Requests',
          'requestingPatientUserId',
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
