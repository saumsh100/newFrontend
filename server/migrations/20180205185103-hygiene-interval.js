'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn('Accounts', 'hygieneInterval', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '6 months',
        }, { transaction: t });

        const accounts = await queryInterface.sequelize.query(`SELECT * FROM "Accounts"`, { transaction: t });

        const allAccounts = accounts[0];

        for (let i = 0; i < allAccounts.length; i += 1) {
          const account = allAccounts[i];

          const months = account.hygieneDueDateSeconds / (60 * 60 * 24 * 30);
          if (months !== 0) {
            await queryInterface
                  .sequelize.query(`UPDATE "Accounts" SET "hygieneInterval" = '${months} months' WHERE "id" = '${account.id}'`
                    , { transaction: t });
          }
        }

        // recall interval
        await queryInterface.addColumn('Accounts', 'recallInterval', {
          type: Sequelize.STRING,
          allowNull: false,
          defaultValue: '6 months',
        }, { transaction: t });

        for (let i = 0; i < allAccounts.length; i += 1) {
          const account = allAccounts[i];

          const months = account.recareDueDateSeconds / (60 * 60 * 24 * 30);
          if (months !== 0) {
            await queryInterface
                  .sequelize.query(`UPDATE "Accounts" SET "recallInterval" = '${months} months' WHERE "id" = '${account.id}'`
                    , { transaction: t });
          }
        }

        await queryInterface.removeColumn('Accounts', 'hygieneDueDateSeconds', { transaction: t });
        await queryInterface.removeColumn('Accounts', 'recareDueDateSeconds', { transaction: t });
      } catch (err) {
        console.log(err);
        return t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn('Accounts', 'hygieneInterval', { transaction: t });
        await queryInterface.removeColumn('Accounts', 'recallInterval', { transaction: t });

        await queryInterface.addColumn('Accounts', 'hygieneDueDateSeconds', {
          type: Sequelize.INTEGER,
          defaultValue: 15552000,
          allowNull: false,
        }, { transaction: t });

        await queryInterface.addColumn('Accounts', 'recareDueDateSeconds', {
          type: Sequelize.INTEGER,
          defaultValue: 23328000,
          allowNull: false,
        }, { transaction: t });
      } catch (err) {
        console.log(err);
        return t.rollback();
      }
    });
  },
};
