'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.sequelize.query(`ALTER TABLE "DeliveredProcedures" ALTER COLUMN "procedureCode" SET NOT NULL`, { transaction: t });

        await queryInterface.sequelize.query(`ALTER TABLE "Accounts" ALTER COLUMN "addressId" SET NOT NULL`, { transaction: t });

        const usAddresses = await queryInterface.sequelize.query(`SELECT * FROM "Addresses" WHERE "country" = 'United States'`, { transaction: t });
        const canAddresses = await queryInterface.sequelize.query(`SELECT * FROM "Addresses" WHERE "country" = 'Canada'`, { transaction: t });

        for (let i = 0; i < usAddresses[0].length; i += 1) {
          const usAddress = usAddresses[0][i];
          await queryInterface.bulkUpdate('Addresses', {
            country: 'US',
          }, {
            id: usAddress.id,
          }, { transaction: t });
        }

        for (let i = 0; i < canAddresses[0].length; i += 1) {
          const canAddress = canAddresses[0][i];
          await queryInterface.bulkUpdate('Addresses', {
            country: 'CA',
          }, {
            id: canAddress.id,
          }, { transaction: t });
        }

        await queryInterface.bulkUpdate('Addresses', {
          country: 'CA',
        }, {
          country: null,
        }, { transaction: t });

        await queryInterface.sequelize.query(`ALTER TABLE "Addresses" ALTER COLUMN "country" SET DEFAULT 'CA'`, { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.sequelize.query(`ALTER TABLE "DeliveredProcedures" ALTER COLUMN "procedureCode" DROP NOT NULL`, { transaction: t });

        await queryInterface.sequelize.query(`ALTER TABLE "Accounts" ALTER COLUMN "addressId" DROP NOT NULL`, { transaction: t });

        await queryInterface.sequelize.query(`ALTER TABLE "Addresses" ALTER COLUMN "country" DROP DEFAULT`, { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },
};
