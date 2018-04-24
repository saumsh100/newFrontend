
'use strict';

module.exports = {
  up(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addIndex('DeliveredProcedures', ['accountId', 'pmsId']);
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },

  down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeIndex('DeliveredProcedures', ['accountId', 'pmsId']);
      } catch (err) {
        console.log(err);
        t.rollback();
      }
    });
  },
};
