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
        await queryInterface.addConstraint('Correspondences', ['accountId', 'pmsId'], {
          type: 'unique',
          name: 'correspondence_accountId_pmsId_unique',
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
        await queryInterface.removeConstraint('Correspondences', 'correspondence_accountId_pmsId_unique', { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  }
};