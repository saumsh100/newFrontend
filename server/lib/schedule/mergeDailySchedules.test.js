

import mergeDailySchedules, {
  mergeStartTime,
  mergeEndTime,
} from './mergeDailySchedules';
import { tzIso, tzTimeHS } from '../../util/time';

const TZ = 'America/Edmonton';
const d = date => tzIso(date, TZ);
const t = date => tzTimeHS(date, TZ);

const ds = (obj = {}) => ({
  isClosed: true,
  startTime: d('2018-12-25 08:00:00'),
  endTime: d('2018-12-25 08:00:00'),
  breaks: [],
  ...obj,
});

describe('Schedule Library', () => {
  describe('#mergeStartTime', () => {
    test('should be a function', () => {
      expect(typeof mergeStartTime).toBe('function');
    });

    test('should return the later startTime (b)', () => {
      const a = d('2018-12-25 08:00:00');
      const b = d('2018-12-25 10:00:00');
      expect(mergeStartTime(a, b)).toBe(b);
    });

    test('should return the later startTime (a)', () => {
      const a = d('2018-12-25 10:00:00');
      const b = d('2018-12-25 08:00:00');
      expect(mergeStartTime(a, b)).toBe(a);
    });

    test('should return the later startTime if equal (a or b)', () => {
      const a = d('2018-12-25 10:00:00');
      const b = d('2018-12-25 10:00:00');
      expect(mergeStartTime(a, b)).toBe(a);
    });
  });

  describe('#mergeEndTime', () => {
    test('should be a function', () => {
      expect(typeof mergeEndTime).toBe('function');
    });

    test('should return the earlier startTime (a)', () => {
      const a = d('2018-12-25 17:00:00');
      const b = d('2018-12-25 18:00:00');
      expect(mergeEndTime(a, b)).toBe(a);
    });

    test('should return the later startTime (b)', () => {
      const a = d('2018-12-25 18:00:00');
      const b = d('2018-12-25 17:00:00');
      expect(mergeEndTime(a, b)).toBe(b);
    });

    test('should return the later startTime if equal (a or b)', () => {
      const a = d('2018-12-25 17:00:00');
      const b = d('2018-12-25 17:00:00');
      expect(mergeEndTime(a, b)).toBe(a);
    });
  });

  describe('#mergeDailySchedules', () => {
    test('should be a function', () => {
      expect(typeof mergeDailySchedules).toBe('function');
    });

    test('should return a dailySchedule that is closed because A is closed', () => {
      const dailyScheduleA = ds();
      const dailyScheduleB = ds({ isClosed: false });
      const { isClosed } = mergeDailySchedules(dailyScheduleA, dailyScheduleB);
      expect(isClosed).toBe(true);
    });

    test('should return a dailySchedule that is closed because A is opened but B is closed', () => {
      const dailyScheduleA = ds({ isClosed: false });
      const dailyScheduleB = ds();
      const { isClosed } = mergeDailySchedules(dailyScheduleA, dailyScheduleB);
      expect(isClosed).toBe(true);
    });

    test('should return a dailySchedule that is respects the boundaries of the dailyScheduleA', () => {
      const dailyScheduleA = ds({
        isClosed: false,
        startTime: d('2018-12-25 09:00:00'),
        endTime: d('2018-12-25 16:00:00'),
      });

      const dailyScheduleB = ds({
        isClosed: false,
        startTime: d('2018-12-25 08:00:00'),
        endTime: d('2018-12-25 17:00:00'),
      });

      const { startTime, endTime } = mergeDailySchedules(dailyScheduleA, dailyScheduleB);
      expect(startTime).toBe(d('2018-12-25 09:00:00'));
      expect(endTime).toBe(d('2018-12-25 16:00:00'));
    });

    test('should return a dailyScheduleB as the boundaries of A don\'t affect it', () => {
      const dailyScheduleA = ds({
        isClosed: false,
        startTime: d('2018-12-25 08:00:00'),
        endTime: d('2018-12-25 17:00:00'),
      });

      const dailyScheduleB = ds({
        isClosed: false,
        startTime: d('2018-12-25 09:00:00'),
        endTime: d('2018-12-25 16:00:00'),
      });

      const { startTime, endTime } = mergeDailySchedules(dailyScheduleA, dailyScheduleB);
      expect(startTime).toBe(d('2018-12-25 09:00:00'));
      expect(endTime).toBe(d('2018-12-25 16:00:00'));
    });
  });
});
