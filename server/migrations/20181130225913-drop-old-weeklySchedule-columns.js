
'use strict';

const moment = require('moment-timezone');

/**
 * DO NOT COPY AND USE THIS FUNCTION, it is only used here for keeping consistency
 * with our init_models migration
 */
function timeWithZone(hours, minutes, timezone) {
  const now = moment(new Date(Date.UTC(1970, 1, 0, hours, minutes)));
  const another = now.clone();
  another.tz(timezone);
  now.add(-1 * another.utcOffset(), 'minutes');
  return now._d;
}

const columnNames = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday',
];

const startTime = timeWithZone(8, 0, 'America/Los_Angeles');
const endTime = timeWithZone(17, 0, 'America/Los_Angeles');
const defaultDailySchedule = {
  isClosed: false,
  startTime,
  endTime,
  breaks: [],
  chairIds: [],
  pmsScheduleId: null,
};

module.exports = {
  async up(queryInterface) {
    return queryInterface.sequelize.transaction(async (t) => {
      await Promise.all(columnNames.map(dayOfWeek =>
        queryInterface.removeColumn('WeeklySchedules', dayOfWeek, { transaction: t })));
    });
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.sequelize.transaction(async (t) => {
      await Promise.all(columnNames.map(dayOfWeek =>
        queryInterface.addColumn(
          'WeeklySchedules',
          `${dayOfWeek}`,
          {
            type: Sequelize.JSONB,
            allowNull: false,
            defaultValue: defaultDailySchedule,
          },
          { transaction: t },
        )));
    });
  },
};
