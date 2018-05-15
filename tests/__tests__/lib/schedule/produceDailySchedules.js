
import produceDailySchedules, {
  mapDailySchedule,
  getWeeklyScheduleFromAdvanced,
} from '../../../../server/lib/schedule/produceDailySchedules';

const schedule = {
  id: '6cc033e5-927e-4abe-8127-d805c074b531',
  startDate: '2018-04-02T00:00:00.000Z',
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
  describe('#mapDailySchedule', () => {
    test('should map an array of daily schedule or an object with the date as a key', () => {
      const result = mapDailySchedule(dailySchedules);
      expect(typeof result).toBe('object');
      expect(result['2017-04-03']).toBe(dailySchedules[0]);
    });
  });

  describe('#getWeeklyScheduleFromAdvanced', () => {
    test('should return first in pattern when date is the same as the pattern startDate', () => {
      const result = getWeeklyScheduleFromAdvanced(scheduleRepeat, '2018-04-02T21:38:33.880Z');
      expect(result.monday.startTime).toBe('1970-01-31T15:00:00.000Z');
    });

    test('should return second in pattern when date is 7 days after the pattern startDate', () => {
      const result = getWeeklyScheduleFromAdvanced(scheduleRepeat, '2018-04-09T21:38:33.880Z');
      expect(result.monday.startTime).toBe('1970-01-31T18:00:00.000Z');
    });

    test('should return first in pattern when date is 14 days the pattern startDate and there\'s only two weeks', () => {
      const result = getWeeklyScheduleFromAdvanced(scheduleRepeat, '2018-04-16T21:38:33.880Z');
      expect(result.monday.startTime).toBe('1970-01-31T15:00:00.000Z');
    });

    describe('DST Awareness Checks', () => {

    });
  });

  describe('#produceDailySchedules', () => {
    test('should return 20 daily schedules with a repeat', async () => {
      const weeklySchedule = JSON.parse(JSON.stringify(scheduleRepeat));
      weeklySchedule.monday.startTime = '1970-01-31T16:00:00.000Z';
      const result = produceDailySchedules(
        weeklySchedule,
        [],
        '2018-04-02T21:38:33.880Z',
        '2018-04-21T21:38:33.880Z',
        'America/Vancouver',
      );

      expect(result['2018-04-02'].startTime).toBe('2018-04-02T15:00:00.000Z');
      expect(result['2018-04-09'].startTime).toBe('2018-04-09T17:00:00.000Z');
    });

    test('should return 20 daily schedules with a repeat and an override', async () => {
      const ds = JSON.parse(JSON.stringify(dailySchedules));
      ds[0].date = '2018-04-03';
      const weeklySchedule = JSON.parse(JSON.stringify(scheduleRepeat));
      weeklySchedule.monday.startTime = '1970-01-31T16:00:00.000Z';

      const result = produceDailySchedules(
        weeklySchedule,
        ds,
        '2018-04-02T21:38:33.880Z',
        '2018-04-21T21:38:33.880Z',
        'America/Vancouver',
      );

      expect(typeof result).toBe('object');
      expect(Object.keys(result)).toHaveLength(20);
      expect(result['2018-04-02'].startTime).toBe('2018-04-02T15:00:00.000Z');
      expect(result['2018-04-03'].startTime).toBe('2018-04-04T00:00:00.000Z');
      expect(result['2018-04-09'].startTime).toBe('2018-04-09T17:00:00.000Z');
    });

    test('should return 20 daily schedules with a repeat and breaks', async () => {
      const weeklySchedule = JSON.parse(JSON.stringify(scheduleRepeat));
      weeklySchedule.monday.startTime = '1970-01-31T16:00:00.000Z';
      weeklySchedule.monday.breaks = [{
        startTime: '1970-01-31T16:00:00.000Z',
        endTime: '1970-01-31T17:00:00.000Z',
      }];

      const result = produceDailySchedules(
        weeklySchedule,
        [],
        '2018-04-02T21:38:33.880Z',
        '2018-04-21T21:38:33.880Z',
        'America/Vancouver',
      );

      expect(typeof result).toBe('object');
      expect(Object.keys(result)).toHaveLength(20);
      expect(result['2018-04-02'].startTime).toBe('2018-04-02T15:00:00.000Z');
      expect(result['2018-04-09'].startTime).toBe('2018-04-09T17:00:00.000Z');
      expect(result['2018-04-02'].breaks[0].startTime).toBe('2018-04-02T15:00:00.000Z');
      expect(result['2018-04-02'].breaks[0].endTime).toBe('2018-04-02T16:00:00.000Z');
    });
  });
});
