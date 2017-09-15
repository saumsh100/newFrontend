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
        await queryInterface.addConstraint('Patients', ['accountId', 'pmsId'], {
          type: 'unique',
          name: 'patient_accountId_pmsId_unique',
        }, { transaction: t });

        await queryInterface.addConstraint('Appointments', ['accountId', 'pmsId'], {
          type: 'unique',
          name: 'appointment_accountId_pmsId_unique',
        }, { transaction: t });

        await queryInterface.addConstraint('Families', ['accountId', 'pmsId'], {
          type: 'unique',
          name: 'family_accountId_pmsId_unique',
        }, { transaction: t });

        await queryInterface.addConstraint('Chairs', ['accountId', 'pmsId'], {
          type: 'unique',
          name: 'chair_accountId_pmsId_unique',
        }, { transaction: t });

        await queryInterface.addConstraint('Services', ['accountId', 'pmsId'], {
          type: 'unique',
          name: 'service_accountId_pmsId_unique',
        }, { transaction: t });

        await queryInterface.addConstraint('Practitioners', ['accountId', 'pmsId'], {
          type: 'unique',
          name: 'practitioner_accountId_pmsId_unique',
        }, { transaction: t });
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
        await queryInterface.removeConstraint('Practitioners', 'practitioner_accountId_pmsId_unique', { transaction: t });
        await queryInterface.removeConstraint('Services', 'service_accountId_pmsId_unique', { transaction: t });
        await queryInterface.removeConstraint('Chairs', 'chair_accountId_pmsId_unique', { transaction: t });
        await queryInterface.removeConstraint('Families', 'family_accountId_pmsId_unique', { transaction: t });
        await queryInterface.removeConstraint('Appointments', 'appointment_accountId_pmsId_unique', { transaction: t });
        await queryInterface.removeConstraint('Patients', 'patient_accountId_pmsId_unique', { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  }
};
