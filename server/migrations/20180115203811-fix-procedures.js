'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        const deliveredProcedures = await queryInterface
          .sequelize.query(`SELECT * FROM "DeliveredProcedures" WHERE "procedureCodeId" LIKE 'CDA-%'`
            , { transaction: t });

        for (let i = 0; i < deliveredProcedures[0].length; i += 1) {
          const deliveredProcedure = deliveredProcedures[0][i];

          await queryInterface.bulkUpdate('DeliveredProcedures', {
            procedureCodeId: deliveredProcedure.procedureCode,
          }, {
            procedureCode: deliveredProcedure.procedureCode,
            procedureCodeId: deliveredProcedure.procedureCodeId,
          }, { transaction: t });
        }

        await queryInterface.bulkDelete('Procedures', {
          code: {
            $like: 'CDA-%',
          },
        }, { transaction: t });

        await queryInterface
              .sequelize.query(`UPDATE "Procedures" SET "code" = 'CDA-' || "code"::text WHERE "code" NOT LIKE 'ADA-%'`
                , { transaction: t });
      } catch (e) {
        console.log(e);
        t.rollback();
      }
    });
  },

  down: function (queryInterface, Sequelize) {
    return Promise.resolve();
  },
};
