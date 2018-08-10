'use strict';

const procedures = require('../fixtures/procedures/procedureDumpV3American.json');

module.exports = {
  up: async function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn('Procedures', 'codeType', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'CDA',
        }, { transaction: t });

        await queryInterface.addColumn('Procedures', 'isValidated', {
          type: Sequelize.BOOLEAN,
          allowNull: false,
          defaultValue: true,
        }, { transaction: t });

        await queryInterface.renameColumn('DeliveredProcedures', 'procedureCode', 'procedureCodeId',
          { transaction: t });

        await queryInterface.addColumn('DeliveredProcedures', 'procedureCode', {
          type: Sequelize.STRING,
          allowNull: true,
        }, { transaction: t });

        await queryInterface
          .sequelize.query('UPDATE "DeliveredProcedures" SET "procedureCode" = "procedureCodeId"'
            , { transaction: t });

        const syncProcedures = procedures.map((procedure) => {
          procedure.code = `ADA-${procedure.code}`;
          return Object.assign({}, procedure, {
            codeType: 'ADA',
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });

        await queryInterface.bulkDelete('Procedures', {
          code: {
            $like: 'D%',
          },
        }, { transaction: t });

        await queryInterface
          .sequelize.query(`UPDATE "Procedures" SET "code" = concat_ws('CDA-', "code"::text)`
            , { transaction: t });

        return queryInterface.bulkInsert(
          'Procedures',
          syncProcedures,
          { transaction: t },
        );
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },

  down: function (queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.removeColumn('Procedures', 'codeType', { transaction: t });

        await queryInterface.removeColumn('Procedures', 'isValidated', { transaction: t });

        await queryInterface.removeColumn('DeliveredProcedures', 'procedureCode', { transaction: t });

        await queryInterface.renameColumn('DeliveredProcedures', 'procedureCodeId', 'procedureCode',
          { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },
};
