'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn('Accounts', 'recallBuffer', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '1 days',
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
        await queryInterface.removeColumn('Accounts', 'recallBuffer', { transaction: t });
      } catch (err) {
        console.log(err);
        return t.rollback();
      }
    });
  }
};
