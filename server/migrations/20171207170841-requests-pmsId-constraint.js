'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addConstraint('Requests', ['accountId', 'pmsId'], {
          type: 'unique',
          name: 'request_accountId_pmsId_unique',
        }, { transaction: t });
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeConstraint('Requests', 'request_accountId_pmsId_unique', { transaction: t });
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
