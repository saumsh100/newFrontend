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
        await queryInterface.addConstraint('Correspondences', ['type', 'sentRecallId'], {
          type: 'unique',
          name: 'correspondence_type_sentRecallId_unique',
        }, { transaction: t });

        await queryInterface.addConstraint('Correspondences', ['type', 'sentReminderId'], {
          type: 'unique',
          name: 'correspondence_type_sentReminderId_unique',
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
        await queryInterface.removeConstraint('Correspondences', 'correspondence_type_sentReminderId_unique', { transaction: t });
        await queryInterface.removeConstraint('Correspondences', 'correspondence_type_sentRecallId_unique', { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },
};
