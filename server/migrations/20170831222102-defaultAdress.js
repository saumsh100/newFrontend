'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    // queryInterface.addConstraint('Patients', ['address'], {
    //   type: 'default',
    //   // defaultValue: {},
    // });
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.sequelize.query(`ALTER TABLE "Patients" ALTER COLUMN "address" SET DEFAULT '{}'::json;`, { transaction: t });
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
        await queryInterface.sequelize.query(`ALTER TABLE "Patients" ALTER COLUMN "address" DROP DEFAULT;`, { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  }
};
