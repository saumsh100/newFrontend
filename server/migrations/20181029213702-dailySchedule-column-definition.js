
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.addColumn(
          'DailySchedules',
          'accountId',
          {
            type: Sequelize.UUID,
            allowNull: true,
            references: {
              model: 'Accounts',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'cascade',
          },
          { transaction: t },
        );

        await queryInterface.changeColumn(
          'DailySchedules',
          'practitionerId',
          {
            type: Sequelize.UUID,
            allowNull: true,
          },
          { transaction: t },
        );

        await queryInterface.changeColumn(
          'DailySchedules',
          'date',
          {
            type: Sequelize.DATEONLY,
            allowNull: true,
          },
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        await queryInterface.changeColumn(
          'DailySchedules',
          'practitionerId',
          {
            type: Sequelize.UUID,
            allowNull: false,
          },
          { transaction: t },
        );

        await queryInterface.changeColumn(
          'DailySchedules',
          'date',
          {
            type: Sequelize.DATEONLY,
            allowNull: false,
          },
          { transaction: t },
        );

        await queryInterface.removeColumn('DailySchedules', 'accountId', { transaction: t });
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
