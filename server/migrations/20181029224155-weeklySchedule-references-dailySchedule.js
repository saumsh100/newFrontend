
'use strict';

const uuid = require('uuid').v4;

const cleanArray = arr => `{"${arr.map(e => cleanEntry(e)).join('", "')}"}`;
const cleanEntry = obj => JSON.stringify(obj).replace(/"/g, '\\"');
const columnNames = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        const [referencedWeeklySchedules] = await queryInterface.sequelize.query(
          `SELECT
          "WeeklySchedules"."id",
          "Practitioners"."accountId"
          FROM
          "WeeklySchedules"
          INNER JOIN "Practitioners" ON "WeeklySchedules"."id" = "Practitioners"."weeklyScheduleId"
          UNION
          SELECT
          "WeeklySchedules"."id",
          "Accounts".id AS "accountId"
          FROM
          "WeeklySchedules"
          INNER JOIN "Accounts" ON "WeeklySchedules"."id" = "Accounts"."weeklyScheduleId";`,
          { transaction: t },
        );

        const weeklySchedules = await queryInterface.sequelize.query(
          `SELECT id, "startDate", ${columnNames.join(',')} FROM "WeeklySchedules";`,
          { transaction: t },
        );

        await Promise.all(columnNames.map(name => queryInterface.addColumn(
          'WeeklySchedules',
          `${name}Id`,
          {
            type: Sequelize.UUID,
            references: {
              model: 'DailySchedules',
              key: 'id',
            },
            onUpdate: 'cascade',
            onDelete: 'set null',
          },
          { transaction: t },
        )));

        await queryInterface.addColumn(
          'WeeklySchedules',
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

        await Promise.all(weeklySchedules[0].map(async (schedule) => {
          const [accountId] = referencedWeeklySchedules
            .filter(obj => obj.id === schedule.id)
            .map(obj => obj.accountId);

          if (accountId) {
            await queryInterface.sequelize.query(
              `UPDATE "WeeklySchedules" SET "accountId" = '${accountId}'
              WHERE id = '${schedule.id}';`,
              { transaction: t },
            );

            await Promise.all(columnNames.map(async (dayOfWeek) => {
              const daySchedule = schedule[dayOfWeek];
              const dailySchedule = {
                id: uuid(),
                date: schedule.startDate || new Date(1970, 1, 1),
                startTime: daySchedule.startTime,
                endTime: daySchedule.endTime,
                createdAt: new Date(),
                updatedAt: new Date(),
                accountId,
                chairIds: (daySchedule.chairIds && daySchedule.chairIds.length > 0) ? daySchedule.chairIds : '{}',
                breaks: (daySchedule.breaks && daySchedule.breaks.length > 0) ? cleanArray(daySchedule.breaks) : '{}',
              };

              await queryInterface.bulkInsert(
                'DailySchedules',
                [dailySchedule],
                { transaction: t },
              );

              await queryInterface.sequelize.query(
                `UPDATE "WeeklySchedules" SET "${dayOfWeek}Id" = '${dailySchedule.id}' WHERE id = '${schedule.id}'`,
                { transaction: t },
              );
            }));
          }
        }));
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      try {
        const [dailySchedules] = await queryInterface.sequelize.query(
          'SELECT w.id AS "weeklyScheduleId", d.id AS "dailyScheduleId" ' +
            'FROM "WeeklySchedules" w, "DailySchedules" d ' +
            'WHERE w."mondayId" = d.id' +
            '   OR w."tuesdayId" = d.id' +
            '   OR w."wednesdayId" = d.id' +
            '   OR w."thursdayId" = d.id' +
            '   OR w."fridayId" = d.id' +
            '   OR w."saturdayId" = d.id' +
            '   OR w."sundayId" = d.id;',
          { transaction: t },
        );

        const dailyScheduleIds = dailySchedules.map(({ dailyScheduleId }) => dailyScheduleId);
        await queryInterface.removeColumn('WeeklySchedules', 'accountId', { transaction: t });
        await Promise.all(columnNames.map(name => queryInterface.removeColumn('WeeklySchedules', `${name}Id`, { transaction: t })));
        await queryInterface.bulkDelete(
          'DailySchedules',
          { id: dailyScheduleIds },
          { transaction: t },
        );
      } catch (err) {
        console.error(err);
        t.rollback();
      }
    });
  },
};
