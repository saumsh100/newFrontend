
'use strict';

module.exports = {
  up: function (queryInterface, DataTypes) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.createTable('Procedures', {
          code: {
            type: DataTypes.STRING,
            primaryKey: true,
          },

          type: {
            type: DataTypes.STRING,
            allowNull: false,
          },

          description: {
            type: DataTypes.STRING,
          },

          createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },

          updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },

          deletedAt: {
            type: DataTypes.DATE,
          },
        }, { transaction: t });

        await queryInterface.createTable('DeliveredProcedures', {
          id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
          },

          accountId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'Accounts',
              key: 'id',
            },

            onUpdate: 'cascade',
          },

          entryDate: {
            allowNull: false,
            type: DataTypes.DATE,
          },

          procedureCode: {
            type: DataTypes.STRING,
            allowNull: false,
            references: {
              model: 'Procedures',
              key: 'code',
            },

            onUpdate: 'cascade',
          },

          patientId: {
            type: DataTypes.UUID,
            allowNull: false,
            references: {
              model: 'Patients',
              key: 'id',
            },

            onUpdate: 'cascade',
          },

          pmsId: {
            type: DataTypes.STRING,
          },

          units: {
            type: DataTypes.FLOAT,
          },

          totalAmount: {
            type: DataTypes.FLOAT,
          },

          primaryInsuranceAmount: {
            type: DataTypes.FLOAT,
          },

          secondaryInsuranceAmount: {
            type: DataTypes.FLOAT,
          },

          patientAmount: {
            type: DataTypes.FLOAT,
          },

          discountAmount: {
            type: DataTypes.FLOAT,
          },

          createdAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },

          updatedAt: {
            allowNull: false,
            type: DataTypes.DATE,
          },

          deletedAt: {
            type: DataTypes.DATE,
          },
        }, { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  },

  down: function (queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.dropTable('DeliveredProcedure', { transaction: t });
        await queryInterface.dropTable('Procedure', { transaction: t });
      } catch (e) {
        console.log(e);
        return t.rollback();
      }
    });
  },
};
