
import modifyDailyScheduleWithTimeoffs from '../../../../server/lib/schedule/practitioners/modifyDailySchedulesWithTimeOffs';

const dailySchedulesList = {
  '2018-04-02': {
    breaks: [],
    startTime: '2018-04-02T16:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '2018-04-02T23:00:00.000Z',
    pmsScheduleId: null,
  },
  '2018-04-03': {
    breaks: [],
    startTime: '2018-04-03T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '2018-04-03T23:50:00.000Z',
    pmsScheduleId: null,
  },
  '2018-04-04': {
    breaks: [],
    startTime: '2018-04-04T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '2018-04-04T23:50:00.000Z',
    pmsScheduleId: null,
  },
  '2018-04-05': {
    breaks: [],
    startTime: '2018-04-05T15:00:00.000Z',
    chairIds: [],
    isClosed: false,
    endTime: '2018-04-05T23:50:00.000Z',
    pmsScheduleId: null,
  },
};

describe('Schedule Library', () => {
  describe('#modifyDailyScheduleWithTimeoffs', () => {
    test.skip('should return same daily schedule as time offs are not part of the schedule ', () => {
      const timeOffs = [
        {
          startDate: '2017-11-06T08:00:00.000Z',
          endDate: '2017-11-06T08:00:00.000Z',
          allDay: true,
        },
        {
          id: '98007dec-656a-4f10-8500-054760add731',
          startDate: '2017-10-23T22:00:00.000Z',
          endDate: '2017-11-12T01:00:00.000Z',
          startTime: null,
          endTime: null,
          interval: null,
          allDay: false,
          fromPMS: false,
          pmsId: null,
          dayOfWeek: null,
        },
      ];

      const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));
      const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');
      expect(dailySchedulesListCopy).toBe(JSON.stringify(body));
    });

    test('should create a break as time off is in middle of day', () => {
      const timeOffs = [{
        startDate: '2018-04-04T16:00:00.000Z',
        endDate: '2018-04-04T17:00:00.000Z',
        allDay: false,
      }];

      const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));
      const result = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');
      expect(result['2018-04-04'].breaks[0].startTime).toBe('2018-04-04T16:00:00.000Z');
      expect(result['2018-04-04'].breaks[0].endTime).toBe('2018-04-04T17:00:00.000Z');
    });

    test('should replace the endTime of schedule with the startDate of timeoff as the timeoff is for the rest of the day', () => {
      const timeOffs = [{
        startDate: '2018-04-04T16:00:00.000Z',
        endDate: '2018-04-05T01:00:00.000Z',
        allDay: false,
      }];

      const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));
      const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');
      expect(body['2018-04-04'].startTime).toBe('2018-04-04T15:00:00.000Z');
      expect(body['2018-04-04'].endTime).toBe('2018-04-04T16:00:00.000Z');
    });

    test('should not change the schedule for day as the timeoff is outside range but same day', () => {
      const timeOffs = [{
        startDate: '2018-04-04T14:00:00.000Z',
        endDate: '2018-04-04T18:00:00.000Z',
        allDay: false,
      }];

      const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));
      const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');
      expect(body['2018-04-04'].startTime).toBe('2018-04-04T18:00:00.000Z');
      expect(body['2018-04-04'].endTime).toBe('2018-04-04T23:50:00.000Z');
    });

    test('should remove the schedule for day as the timeoff is outside range and same day, but marked allDay', () => {
      const timeOffs = [{
        startDate: '2018-04-04T14:00:00.000Z',
        endDate: '2018-04-04T18:00:00.000Z',
        allDay: true,
      }];

      const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));
      const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');
      expect(body['2018-04-04'].isClosed).toBe(true);
    });

    test('should remove the schedule for day as the timeoff encompasses the schedule', () => {
      const timeOffs = [{
        startDate: '2018-04-04T14:00:00.000Z',
        endDate: '2018-04-05T01:00:00.000Z',
        allDay: false,
      }];

      const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));
      const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');
      expect(body['2018-04-04'].isClosed).toBe(true);
    });

    test('should change the endDate of 3 days and mark off one as the timeOff goes for multiple days', () => {
      const timeOffs = [{
        startDate: '2018-04-02T16:00:00.000Z',
        endDate: '2018-04-06T01:00:00.000Z',
        allDay: false,
      }];

      const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));
      const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');

      expect(body['2018-04-02'].startTime).toBe('2018-04-02T16:00:00.000Z');
      expect(body['2018-04-02'].endTime).toBe('2018-04-02T16:00:00.000Z');
      expect(body['2018-04-03'].isClosed).toBe(true);
      expect(body['2018-04-04'].isClosed).toBe(true);
      expect(body['2018-04-05'].isClosed).toBe(true);
    });

    test('should change the endDate of 3 days and mark off one as the timeOff goes for multiple days', () => {
      const timeOffs = [{
        startDate: '2018-04-02T16:00:00.000Z',
        endDate: '2018-04-05T18:00:00.000Z',
        allDay: false,
      }];

      const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));
      const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');

      expect(body['2018-04-02'].isClosed).toBe(false);
      expect(body['2018-04-02'].startTime).toBe('2018-04-02T16:00:00.000Z');
      expect(body['2018-04-02'].endTime).toBe('2018-04-02T16:00:00.000Z');
      expect(body['2018-04-03'].isClosed).toBe(true);
      expect(body['2018-04-04'].isClosed).toBe(true);
      expect(body['2018-04-05'].isClosed).toBe(false);
      expect(body['2018-04-05'].startTime).toBe('2018-04-05T18:00:00.000Z');
      expect(body['2018-04-05'].endTime).toBe('2018-04-05T23:50:00.000Z');
    });

    test('should mark off multiple days as the timeOffs goes for multiple days', () => {
      const timeOffs = [{
        startDate: '2018-04-02T16:00:00.000Z',
        endDate: '2018-04-06T01:00:00.000Z',
        practitionerId: '82982076-6823-4da9-b962-3771ef588b94',
        allDay: true,
      }];

      const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));
      const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');
      expect(body['2018-04-03'].isClosed).toBe(true);
      expect(body['2018-04-04'].isClosed).toBe(true);
    });
  });
});
