
'use strict';

const uuid = require('uuid');

const templateName = 'donna-respond-outside-office-hours';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      const templateId = uuid();
      await queryInterface.bulkInsert('Templates', [{
        id: templateId,
        templateName,
        values: JSON.stringify({
          'account.name': true,
          nextOpenedTime: true,
        }),
        createdAt: new Date(),
        updatedAt: new Date(),
      }]);

      await queryInterface.bulkInsert('AccountTemplates', [{
        id: uuid(),
        templateId,
        value: '${account.name} is currently closed. We will be back ${nextOpenedTime} and will respond to you then.',
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
