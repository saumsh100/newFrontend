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
        await queryInterface.addConstraint('PractitionerRecurringTimeOffs', ['practitionerId', 'pmsId'], {
          type: 'unique',
          name: 'practitioner_practitionerId_pmsId_unique',
        }, { transaction: t });

        await queryInterface.removeConstraint('PractitionerRecurringTimeOffs', 'PractitionerRecurringTimeOffs_pmsId_key');
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
        await queryInterface.removeConstraint('PractitionerRecurringTimeOffs', 'practitioner_practitionerId_pmsId_unique', { transaction: t });

        await queryInterface.addConstraint('PractitionerRecurringTimeOffs', ['pmsId'], {
          type: 'unique',
          name: 'PractitionerRecurringTimeOffs_pmsId_key',
        });

      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },
};
