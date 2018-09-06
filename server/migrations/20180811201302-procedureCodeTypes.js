
'use strict';

const uuid = require('uuid').v4;

const HYGIENE_PROCEDURE_CODES = 'HYGIENE_PROCEDURE_CODES';
const RECALL_PROCEDURE_CODES = 'RECALL_PROCEDURE_CODES';
const NP_EXAM_PROCEDURE_CODES = 'NP_EXAM_PROCEDURE_CODES';
const RESTORATIVE_PROCEDURE_CODES = 'RESTORATIVE_PROCEDURE_CODES';

module.exports = {
  up: (queryInterface) => {
    queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.bulkInsert('Configurations', [
          {
            id: uuid(),
            name: HYGIENE_PROCEDURE_CODES,
            defaultValue: '[]',
            description: 'A json array of "hygiene" procedure codes',
            type: 'json',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuid(),
            name: RECALL_PROCEDURE_CODES,
            defaultValue: '[]',
            description: 'A json array of "recall exam" procedure codes',
            type: 'json',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuid(),
            name: NP_EXAM_PROCEDURE_CODES,
            defaultValue: '[]',
            description: 'A json array of "new patient exam" procedure codes',
            type: 'json',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            id: uuid(),
            name: RESTORATIVE_PROCEDURE_CODES,
            defaultValue: '[]',
            description: 'A json array of "restorative" procedure codes',
            type: 'json',
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ], { transaction: t });
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },

  down: (queryInterface) => {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        const configurations = await queryInterface
          .sequelize.query(`
            SELECT * FROM "Configurations"
            WHERE "name"='${HYGIENE_PROCEDURE_CODES}'
            OR "name"='${RECALL_PROCEDURE_CODES}'
            OR "name"='${NP_EXAM_PROCEDURE_CODES}'
            OR "name"='${RESTORATIVE_PROCEDURE_CODES}'
          `, { transaction: t });

        const configurationIds = configurations[0].map(c => c.id);
        await queryInterface.bulkDelete('AccountConfigurations', {
          configurationId: configurationIds,
        }, { transaction: t });

        await queryInterface.bulkDelete('Configurations', {
          name: [
            HYGIENE_PROCEDURE_CODES,
            RECALL_PROCEDURE_CODES,
            NP_EXAM_PROCEDURE_CODES,
            RESTORATIVE_PROCEDURE_CODES,
          ],
        }, { transaction: t });
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
