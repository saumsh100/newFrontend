
'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) =>
    queryInterface.sequelize.transaction(async (transaction) => {
      try {
        await queryInterface.createTable('Templates', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },

          templateName: {
            type: Sequelize.STRING,
            allowNull: false,
          },

          values: {
            type: Sequelize.JSONB,
            allowNull: false,
          },

          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },

          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },

          deletedAt: { type: Sequelize.DATE },
        }, { transaction });

        return await queryInterface.createTable('AccountTemplates', {
          id: {
            type: Sequelize.UUID,
            defaultValue: Sequelize.UUIDV4,
            primaryKey: true,
          },

          accountId: {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'Accounts',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
          },

          templateId: {
            type: Sequelize.UUID,
            allowNull: false,
            references: {
              model: 'Templates',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
          },

          value: {
            type: Sequelize.STRING,
            allowNull: false,
          },

          createdAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },

          updatedAt: {
            allowNull: false,
            type: Sequelize.DATE,
          },

          deletedAt: { type: Sequelize.DATE },
        }, { transaction });
      } catch (err) {
        console.error(err);
        transaction.rollback();
      }
    }),

  down: queryInterface => queryInterface.sequelize.transaction(async (transaction) => {
    try {
      await queryInterface.dropTable('AccountTemplates', { transaction });
      return await queryInterface.dropTable('Templates', { transaction });
    } catch (e) {
      console.log(e);
      return transaction.rollback();
    }
  }),
};
