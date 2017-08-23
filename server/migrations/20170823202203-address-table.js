'use strict';

module.exports = {
  up: async function (queryInterface, Sequelize) {

    await queryInterface.createTable('Addresses', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },

      accountId: {
        type: Sequelize.UUID,
        allowNull: false,
      },

      street: {
        type: Sequelize.STRING,
      },

      country: {
        type: Sequelize.STRING,
      },

      state: {
        type: Sequelize.STRING,
      },

      city: {
        type: Sequelize.STRING,
      },

      zipCode: {
        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },

      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    // const account = queryInterface.select('Accounts');
    // console.log(account)
    await queryInterface.sequelize.query('ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts"(id) MATCH SIMPLE ON UPDATE CASCADE;');
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
  },

  down: async function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable('Addresses');
  }
};
