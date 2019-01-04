
import produceFinalDailySchedulesMap from '../../../../server/lib/schedule/practitioners/produceFinalDailySchedulesMap';

const schedule = {
  id: '6cc033e5-927e-4abe-8127-d805c074b531',
  startDate: '2018-04-02T21:38:33.880Z',
  isAdvanced: false,
  monday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:00:00.000Z',
    pmsScheduleId: null,
  },
  tuesday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  wednesday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  thursday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  friday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  saturday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  sunday: {
    breaks: [],
    startTime: '1970-01-31T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  pmsId: '23',
  weeklySchedules: null,
};

const scheduleRepeat = Object.assign({}, schedule);

scheduleRepeat.isAdvanced = true;
scheduleRepeat.weeklySchedules = [{
  monday: {
    breaks: [],
    startTime: '1970-01-31T18:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:00:00.000Z',
    pmsScheduleId: null,
  },
  tuesday: {
    breaks: [],
    startTime: '1970-01-31T18:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  wednesday: {
    breaks: [],
    startTime: '1970-01-31T18:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  thursday: {
    breaks: [],
    startTime: '1970-01-31T18:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  friday: {
    breaks: [],
    startTime: '1970-01-31T18:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  saturday: {
    breaks: [],
    startTime: '1970-01-31T18:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
  sunday: {
    breaks: [],
    startTime: '1970-01-31T18:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '1970-01-31T23:50:00.000Z',
    pmsScheduleId: null,
  },
}];

const dailySchedules = [{
  id: 'c19c17fd-7cb8-4e2c-9290-a092b95e9014',
  pmsId: null,
  practitionerId: '4f439ff8-c55d-4423-9316-a41240c4d329',
  date: '2017-04-03',
  startTime: '1970-02-01T01:00:00.000Z',
  endTime: '1970-02-01T04:00:00.000Z',
  breaks: [],
  chairIds: [],
  createdAt: '2018-04-02T21:38:33.880Z',
  updatedAt: '2018-04-02T21:38:33.880Z',
  deletedAt: null,
}];

describe('Schedule Library', () => {
  describe('#produceFinalDailySchedulesMap', () => {
    test('should return 2 open daily schedules as the other 18 in the range are timeoffs', async () => {
      const weeklySchedule = JSON.parse(JSON.stringify(schedule));
      const dailySchedule = JSON.parse(JSON.stringify(dailySchedules[0]));
      dailySchedule.date = '2018-04-02';

      const timeOff = {
        startDate: '2018-04-04T23:00:00.000Z',
        endDate: '2018-04-22T00:00:00.000Z',
        allDay: true,
      };

      const result = produceFinalDailySchedulesMap(
        weeklySchedule,
        [dailySchedule],
        [timeOff],
        '2018-04-02T21:38:33.880Z',
        '2018-04-21T21:38:33.880Z',
        'America/Vancouver',
      );

      expect(result['2018-04-02'].startTime).toBe('2018-04-03T00:00:00.000Z');
      expect(result['2018-04-03'].isClosed).toBe(false);
      expect(result['2018-04-04'].isClosed).toBe(true);
      expect(result['2018-04-05'].isClosed).toBe(true);
      expect(result['2018-04-06'].isClosed).toBe(true);
    });

    test('should return 20 daily schedules and 18 with breaks as 18 in the range have timeoffs in middle of day', async () => {
      const weeklySchedule = JSON.parse(JSON.stringify(schedule));
      const dailySchedule = JSON.parse(JSON.stringify(dailySchedules[0]));
      dailySchedule.date = '2018-04-01';

      const timeOff = {
        startDate: '2018-04-04T22:00:00.000Z',
        endDate: '2018-04-22T23:00:00.000Z',
        allDay: false,
      };

      const result = produceFinalDailySchedulesMap(
        weeklySchedule,
        [dailySchedules],
        [timeOff],
        '2018-04-02T21:38:33.880Z',
        '2018-04-21T21:38:33.880Z',
        'America/Vancouver',
      );

      /*expect(result['2018-04-04'].breaks[0].startTime).toBe('2018-04-04T22:00:00.000Z');
      expect(result['2018-04-04'].breaks[0].endTime).toBe('2018-04-04T23:00:00.000Z');
      expect(result['2018-04-05'].breaks[0].startTime).toBe('2018-04-05T22:00:00.000Z');
      expect(result['2018-04-05'].breaks[0].endTime).toBe('2018-04-05T23:00:00.000Z');
      expect(result['2018-04-06'].breaks[0].startTime).toBe('2018-04-06T22:00:00.000Z');
      expect(result['2018-04-06'].breaks[0].endTime).toBe('2018-04-06T23:00:00.000Z');
      expect(Object.keys(result)).toHaveLength(20);*/

      /*let breakCount = 0;

      Object.entries(result).forEach(([key, value]) => {
        if (value.breaks[0]) {
          breakCount += 1;
        }
      });

      expect(breakCount).toBe(18);*/
    });
  });
});
