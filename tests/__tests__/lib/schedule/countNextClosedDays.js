
import { WeeklySchedule } from '../../../../server/_models';
import { wipeAllModels } from '../../../util/wipeModel';
import countNextClosedDays from '../../../../server/lib/schedule/countNextClosedDays';
import { saveWeeklyScheduleWithDefaults } from '../../../../server/_models/WeeklySchedule';

describe('Schedule Utilities', () => {
  beforeEach(async () => {
    await wipeAllModels();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('#countNextClosedDays', () => {
    test('it should be a function', () => {
      expect(typeof countNextClosedDays).toBe('function');
    });

    let fullWeekOpen;
    let threeDaysClose;
    let twoDaysClose;
    let fullWeekClose;
    beforeEach(async () => {
      // Default weeklyschedule is 8-5 PST open all days
      fullWeekOpen = await saveWeeklyScheduleWithDefaults({}, WeeklySchedule);
      threeDaysClose = await saveWeeklyScheduleWithDefaults({
        friday: { isClosed: true },
        saturday: { isClosed: true },
        sunday: { isClosed: true },
      }, WeeklySchedule);
      twoDaysClose = await saveWeeklyScheduleWithDefaults({
        saturday: { isClosed: true },
        sunday: { isClosed: true },
      }, WeeklySchedule);
      fullWeekClose = await saveWeeklyScheduleWithDefaults({
        monday: { isClosed: true },
        tuesday: { isClosed: true },
        wednesday: { isClosed: true },
        thursday: { isClosed: true },
        friday: { isClosed: true },
        saturday: { isClosed: true },
        sunday: { isClosed: true },
      }, WeeklySchedule);
    });

    test('should return 0 because the next day is open', () => {
      expect(countNextClosedDays({
        weeklySchedule: fullWeekOpen,
        startDate: new Date(), // doesn't matter its always open
      })).toBe(0);
    });

    test('should return 3 because the next 3 days are closed', () => {
      expect(countNextClosedDays({
        weeklySchedule: threeDaysClose,
        startDate: new Date(2018, 2, 22), // Thursday
      })).toBe(3);
    });

    test('should return 1 because the next day is closed but not the day after', () => {
      expect(countNextClosedDays({
        weeklySchedule: threeDaysClose,
        startDate: new Date(2018, 2, 24), // Saturday
      })).toBe(1);
    });

    test('should return 0 because the next day is open', () => {
      expect(countNextClosedDays({
        weeklySchedule: twoDaysClose,
        startDate: new Date(2018, 2, 22), // Thursday
      })).toBe(0);
    });

    test('should return 5 because thats the default max', () => {
      expect(countNextClosedDays({
        weeklySchedule: fullWeekClose,
        startDate: new Date(2018, 2, 22), // Thursday
      })).toBe(5);
    });

    test('should return 10 because thats the max supplied', () => {
      expect(countNextClosedDays({
        weeklySchedule: fullWeekClose,
        startDate: new Date(2018, 2, 22), // Thursday
        maxDays: 10,
      })).toBe(10);
    });
  });
});
