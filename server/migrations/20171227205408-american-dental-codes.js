'use strict';

const procedures = require('../fixtures/procedures/procedureDumpV3American.json');

module.exports = {
  up: async function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn('Procedures', 'codeType', {
          type: Sequelize.STRING,
          allowNull: true,
          defaultValue: 'Canadian Dental Code',
        }, { transaction: t });

        const syncProcedures = procedures.map((procedure) => {
          return Object.assign({}, procedure, {
            createdAt: new Date(),
            updatedAt: new Date(),
          });
        });

        const code = procedures.map((procedure) => {
          return procedure.code;
        });

        await queryInterface.changeColumn('Procedures', 'codeType', {
          type: Sequelize.STRING,
          allowNull: true,
        }, { transaction: t });

        await queryInterface.bulkDelete('Procedures', {
          code,
        }, { transaction: t });

        await queryInterface.bulkUpdate('Procedures', {
          codeType: 'American Dental Code',
        }, {
          code: {
            $like: 'D%',
          },
        }, { transaction: t });

        return queryInterface.bulkInsert(
          'Procedures',
          syncProcedures,
          { transaction: t }
        );
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },

  down: function (queryInterface) {
    return queryInterface.bulkDelete('DeliveredProcedures', null, {})
    .then(() => {
      return queryInterface.bulkDelete('Procedures', null, {});
    });
  },
};
