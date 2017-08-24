'use strict';
const uuid = require('uuid').v4;

module.exports = {
  up: async function (queryInterface, Sequelize) {

    const test = await queryInterface.createTable('Addresses', {
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

      deletedAt: {
        type: Sequelize.DATE,
      },
    });

    console.log(test)
    // const account = queryInterface.select('Accounts');
    // console.log(account)
    const Accounts = await queryInterface.sequelize.query('SELECT * FROM "Accounts"');

    const populateAddress = [];

    Accounts[0].forEach((account) => {
      populateAddress.push({
        id: uuid(),
        accountId: account.id,
        street: account.street,
        country: account.country,
        state: account.state,
        city: account.city,
        zipCode: account.zipCode,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    });

    await queryInterface.bulkInsert('Addresses', populateAddress);

    await queryInterface.sequelize.query('ALTER TABLE "Addresses" ADD CONSTRAINT "Addresses_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "Accounts"(id) MATCH SIMPLE ON UPDATE CASCADE;');

    await queryInterface.removeColumn('Accounts', 'street');
    await queryInterface.removeColumn('Accounts', 'country');
    await queryInterface.removeColumn('Accounts', 'state');
    await queryInterface.removeColumn('Accounts', 'city');
    await queryInterface.removeColumn('Accounts', 'zipCode');
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
    // const Addresses = await queryInterface.sequelize.query('SELECT * FROM "Addresses"');
    // console.log(Addresses[0])
    // await queryInterface.addColumn(
    //   'Accounts',
    //   'street',
    //   Sequelize.STRING
    // );
    // await queryInterface.addColumn(
    //   'Accounts',
    //   'country',
    //   Sequelize.STRING
    // );
    // await queryInterface.addColumn(
    //   'Accounts',
    //   'state',
    //   Sequelize.STRING
    // );
    // await queryInterface.addColumn(
    //   'Accounts',
    //   'city',
    //   Sequelize.STRING
    // );
    // await queryInterface.addColumn(
    //   'Accounts',
    //   'zipCode',
    //   Sequelize.STRING
    // );

    // for (let i = 0; i < Addresses[0].length; i += 1) {
    //   const replacements = {
    //     id: Addresses[0][i].accountId,
    //     state: Addresses[0][i].state,
    //     street: Addresses[0][i].street,
    //     country: Addresses[0][i].country,
    //     zipCode: Addresses[0][i].zipCode,
    //     city: Addresses[0][i].city,
    //   };
    //   await queryInterface.sequelize.query(`
    //         UPDATE "Accounts"
    //         SET street = :street, country = :country,
    //         state = :state, city = :city, "zipCode" = :zipCode
    //         WHERE id = :id
    //       `, {
    //         replacements,
    //       });
    // }
    // return queryInterface.dropTable('Addresses');
  }
};
