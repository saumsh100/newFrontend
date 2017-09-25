
'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'Accounts',
          'adapterType',
          { type: Sequelize.STRING },
        );
      } catch (e) {
        console.error(e);
        return t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn('Accounts', 'adapterType');
      } catch (e) {
        console.error(e);
        return t.rollback();
      }
    });
  }
};
