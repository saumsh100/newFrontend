
'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (transaction) => {
      try {
        await queryInterface.createTable(
          'ReasonDailySchedules',
          {
            id: {
              type: Sequelize.UUID,
              defaultValue: Sequelize.UUIDV4,
              primaryKey: true,
            },

            accountId: {
              type: Sequelize.UUID,
              references: {
                model: 'Accounts',
                key: 'id',
              },
              allowNull: false,
              onUpdate: 'cascade',
              onDelete: 'cascade',
            },

            date: { type: Sequelize.DATEONLY },

            donnaTimeOffs: {
              type: Sequelize.ARRAY(Sequelize.JSONB),
              allowNull: false,
              defaultValue: [],
            },

            setAvailabilities: {
              type: Sequelize.ARRAY(Sequelize.JSONB),
              allowNull: false,
              defaultValue: [],
            },

            donnaFillingAllDay: {
              type: Sequelize.BOOLEAN,
              allowNull: false,
              defaultValue: true,
            },
          },
          { transaction },
        );

        await queryInterface.createTable(
          'ReasonSchedules',
          {
            id: {
              type: Sequelize.UUID,
              defaultValue: Sequelize.UUIDV4,
              primaryKey: true,
            },

            accountId: {
              type: Sequelize.UUID,
              references: {
                model: 'Accounts',
                key: 'id',
              },
              allowNull: false,
              onUpdate: 'cascade',
              onDelete: 'cascade',
            },

            mondayId: {
              type: Sequelize.UUID,
              references: {
                model: 'ReasonDailySchedules',
                key: 'id',
              },
              allowNull: false,
            },

            tuesdayId: {
              type: Sequelize.UUID,
              references: {
                model: 'ReasonDailySchedules',
                key: 'id',
              },
              allowNull: false,
            },

            wednesdayId: {
              type: Sequelize.UUID,
              references: {
                model: 'ReasonDailySchedules',
                key: 'id',
              },
              allowNull: false,
            },

            thursdayId: {
              type: Sequelize.UUID,
              references: {
                model: 'ReasonDailySchedules',
                key: 'id',
              },
              allowNull: false,
            },

            fridayId: {
              type: Sequelize.UUID,
              references: {
                model: 'ReasonDailySchedules',
                key: 'id',
              },
              allowNull: false,
            },

            saturdayId: {
              type: Sequelize.UUID,
              references: {
                model: 'ReasonDailySchedules',
                key: 'id',
              },
              allowNull: false,
            },

            sundayId: {
              type: Sequelize.UUID,
              references: {
                model: 'ReasonDailySchedules',
                key: 'id',
              },
              allowNull: false,
            },
          },
          { transaction },
        );

        await queryInterface.addColumn(
          'Services',
          'reasonScheduleId',
          {
            type: Sequelize.UUID,
            references: {
              model: 'ReasonSchedules',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'set null',
          },
          { transaction },
        );
      } catch (err) {
        console.error(err);
        transaction.rollback();
      }
    });
  },

  async down(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeColumn('Services', 'reasonScheduleId', { transaction: t });
      await queryInterface.dropTable('ReasonSchedules', { transaction: t });
      await queryInterface.dropTable('ReasonDailySchedules', { transaction: t });
    });
  },
};
