
'use strict';

const uuid = require('uuid');

const templateName = 'review-request';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async () => {
      const templateId = uuid();
      await queryInterface.bulkInsert('Templates', [{
        id: templateId,
        templateName,
        values: JSON.stringify({
          'account.name': true,
          'patient.firstName': true,
          link: true,
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);
      await queryInterface.bulkInsert('AccountTemplates', [{
        id: uuid(),
        templateId,
        value: '${patient.firstName}, we hope you had a lovely visit at ${account.name}. Let us know how it went by clicking the link below. ${link}',
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);
    });
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      const selectTemplate = await queryInterface
        .sequelize.query(`
            SELECT id FROM "Templates"
            WHERE "templateName" = '${templateName}';
          `, { transaction: t });
      const templateId = selectTemplate[0].map(c => c.id);
      await queryInterface.bulkDelete('Templates', { id: templateId }, { transaction: t });
      await queryInterface.bulkDelete('AccountTemplates', { templateId }, { transaction: t });
    });
  },
};
