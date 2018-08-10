'use strict';
const uuid = require('uuid').v4;

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.createTable('CronConfigurations', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },

          defaultValue: {
            type: Sequelize.STRING,
          },

          description: {
            type: Sequelize.STRING,
            allowNull: false,
          },

          name: {
            type: Sequelize.STRING,
            allowNull: false,
          },

          type: {
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

        await queryInterface.createTable('AccountCronConfigurations', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },

          value: {
            type: Sequelize.STRING,
          },

          cronConfigurationId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'CronConfigurations',
              key: 'id',
            },
            onUpdate: 'cascade',
          },

          accountId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'Accounts',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
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
        }, {
          transaction: t,
          uniqueKeys: {
            actions_unique: {
              fields: ['accountId', 'cronConfigurationId'],
            },
          },
        });

        await queryInterface.bulkInsert('CronConfigurations', [{
          id: uuid(),
          name: 'CRON_LAST_HYGIENE',
          defaultValue: null,
          description: 'The last time the Cron for a patients Last Hygiene was run',
          type: 'isoString',
          createdAt: new Date(),
          updatedAt: new Date(),
        }], { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.dropTable('AccountCronConfigurations', { transaction: t });
        await queryInterface.dropTable('CronConfigurations', { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },
};
