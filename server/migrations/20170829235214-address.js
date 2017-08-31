'use strict';
const uuid = require('uuid').v4;

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
        await queryInterface.createTable('Addresses', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
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

          timezone: {
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
        }, { transaction: t });

        const Accounts = await queryInterface.sequelize.query('SELECT * FROM "Accounts"', { transaction: t });

        const populateAddress = [];
        const updateAccounts = [];

        Accounts[0].forEach((account) => {
          const id = uuid();

          updateAccounts.push({
            id: account.id,
            addressId: id,
          });

          populateAddress.push({
            id,
            street: account.street,
            country: account.country,
            state: account.state,
            city: account.city,
            zipCode: account.zipCode,
            timezone: account.timezone,
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });


        await queryInterface.addColumn(
          'Accounts',
          'addressId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'Addresses',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'set null',
          }, { transaction: t });

        if (populateAddress[0]) {
          await queryInterface.bulkInsert('Addresses', populateAddress, { transaction: t });
        }


        for (let i = 0; i < updateAccounts.length; i += 1) {
          await queryInterface.sequelize.query(`
            UPDATE "Accounts"
            SET "addressId" = :addressId
            WHERE id = :id
          `, {
            replacements: updateAccounts[i],
            transaction: t,
          });
        }

        await queryInterface.removeColumn('Accounts', 'street', { transaction: t });
        await queryInterface.removeColumn('Accounts', 'country', { transaction: t });
        await queryInterface.removeColumn('Accounts', 'state', { transaction: t });
        await queryInterface.removeColumn('Accounts', 'city', { transaction: t });
        await queryInterface.removeColumn('Accounts', 'zipCode', { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  },

  down: async function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        const Accounts = await queryInterface.sequelize.query('SELECT * FROM "Accounts";', { transaction: t });

        await queryInterface.addColumn(
          'Accounts',
          'street',
          Sequelize.STRING,
          { transaction: t },
        );
        await queryInterface.addColumn(
          'Accounts',
          'country',
          Sequelize.STRING,
          { transaction: t },
        );
        await queryInterface.addColumn(
          'Accounts',
          'state',
          Sequelize.STRING,
          { transaction: t },
        );
        await queryInterface.addColumn(
          'Accounts',
          'city',
          Sequelize.STRING,
          { transaction: t },
        );
        await queryInterface.addColumn(
          'Accounts',
          'zipCode',
          Sequelize.STRING,
          { transaction: t },
        );


        for (let i = 0; i < Accounts[0].length; i += 1) {
          if (Accounts[0][i].addressId) {
            const address = await queryInterface.sequelize.query('SELECT * FROM "Addresses" WHERE id = :id;', { replacements: { id: Accounts[0][i].addressId }, transaction: t });
            if (address[0][0]) {
              const replacements = {
                id: Accounts[0][i].id,
                state: address[0][0].state,
                street: address[0][0].street,
                country: address[0][0].country,
                zipCode: address[0][0].zipCode,
                city: address[0][0].city,
                timezone: address[0][0].timezone,
              };
              await queryInterface.sequelize.query(`
                    UPDATE "Accounts"
                    SET street = :street, country = :country,
                    state = :state, city = :city, "zipCode" = :zipCode,
                    timezone = :timezone
                    WHERE id = :id
                  `, {
                    replacements,
                    transaction: t,
                  });
            }
          }
        }
        await queryInterface.removeColumn('Accounts', 'addressId', { transaction: t });
        await queryInterface.dropTable('Addresses', { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  },
};
