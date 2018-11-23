
'use strict';

const defaultCellPhoneNumberFallback = [
  'mobilePhoneNumber',
  'otherPhoneNumber',
  'homePhoneNumber',
];

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.addColumn(
        'Accounts',
        'cellPhoneNumberFallback',
        {
          type: Sequelize.ARRAY(Sequelize.STRING),
          allowNull: false,
          defaultValue: defaultCellPhoneNumberFallback,
        },
        { transaction: t },
      );

      await queryInterface.addColumn(
        'Patients',
        'cellPhoneNumber',
        { type: Sequelize.STRING },
        { transaction: t },
      );

      const pageSize = 100000;
      const [[{ count }]] = await queryInterface.sequelize.query(`SELECT COUNT(id)/${pageSize} +1 AS count FROM "Patients"`, { transaction: t });

      for (let i = 0; i < count; i++) {
        await queryInterface.sequelize.query(`UPDATE "Patients"
          SET
            "cellPhoneNumber" = COALESCE("${defaultCellPhoneNumberFallback.join('","')}")
          WHERE id IN (
          SELECT id FROM "Patients"
          ORDER BY id
          LIMIT ${pageSize}
          OFFSET ${pageSize * i})`, { transaction: t });
      }
    });
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('Patients', 'cellPhoneNumber', { transaction: t });
      await queryInterface.removeColumn('Accounts', 'cellPhoneNumberFallback', { transaction: t });
    });
  },
};
