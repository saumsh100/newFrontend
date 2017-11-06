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
        await queryInterface.sequelize.query(`ALTER TABLE "Practitioners" ALTER COLUMN "lastName" DROP NOT NULL;`, { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
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
        await queryInterface.sequelize.query(`
          UPDATE "Practitioners"
          SET "lastName" = ''
          WHERE "lastName" IS NULL
        `, {
          replacements: {},
          transaction: t,
        });
        await queryInterface.sequelize.query(`ALTER TABLE "Practitioners" ALTER COLUMN "lastName" SET NOT NULL;`, { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  }
};
