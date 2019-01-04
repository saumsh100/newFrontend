
'use strict';

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.sequelize.query(
        `UPDATE "DailySchedules"
        SET
        "accountId" =
        (SELECT "accountId" FROM "Practitioners" WHERE "DailySchedules"."practitionerId" = "Practitioners".id)
        WHERE "accountId" IS NULL`,
        { transaction: t },
      );
    });
  },

  down(queryInterface) {
    return Promise.resolve();
  },
};
