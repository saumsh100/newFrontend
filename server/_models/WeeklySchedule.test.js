
import { WeeklySchedule } from 'CareCruModels';
import { saveWeeklyScheduleWithDefaults } from './WeeklySchedule';
import { wipeAllModels } from '../../tests/util/wipeModel';
import { accountId, seedTestUsers } from '../../tests/util/seedTestUsers';

describe('models/WeeklySchedule', () => {
  beforeEach(async () => {
    await wipeAllModels();
    await seedTestUsers();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('#saveWeeklyScheduleWithDefaults', () => {
    test('should be a function', () => {
      expect(typeof saveWeeklyScheduleWithDefaults).toBe('function');
    });

    test('should save the default dailySchedules and associate properly', async () => {
      const weeklyScheduleData = { accountId };
      const savedWeeklySchedule = await saveWeeklyScheduleWithDefaults(weeklyScheduleData, WeeklySchedule);
      // Pick a few days to ensure they are equal to the defaults
      expect(savedWeeklySchedule.monday.startTime.toISOString()).toBe('1970-01-31T16:00:00.000Z');
      expect(savedWeeklySchedule.monday.endTime.toISOString()).toBe('1970-02-01T01:00:00.000Z');
      expect(savedWeeklySchedule.sunday.startTime.toISOString()).toBe('1970-01-31T16:00:00.000Z');
      expect(savedWeeklySchedule.sunday.endTime.toISOString()).toBe('1970-02-01T01:00:00.000Z');
    });

    test('should have null values for startDate', async () => {
      const weeklyScheduleData = {
        accountId,
        monday: {
          accountId,
          startTime: '1970-01-31T13:00:00.000Z',
          endTime: '1970-01-31T18:00:00.000Z',
        },

        sunday: {
          accountId,
          startTime: '1970-01-31T13:30:00.000Z',
          endTime: '1970-01-31T18:30:00.000Z',
        }
      };

      const savedWeeklySchedule = await saveWeeklyScheduleWithDefaults(weeklyScheduleData, WeeklySchedule);
      // Pick a few days to ensure they are equal to the provided data
      expect(savedWeeklySchedule.monday.startTime.toISOString()).toBe('1970-01-31T13:00:00.000Z');
      expect(savedWeeklySchedule.monday.endTime.toISOString()).toBe('1970-01-31T18:00:00.000Z');
      expect(savedWeeklySchedule.sunday.startTime.toISOString()).toBe('1970-01-31T13:30:00.000Z');
      expect(savedWeeklySchedule.sunday.endTime.toISOString()).toBe('1970-01-31T18:30:00.000Z');
      // Ensure other days have the defaults
      expect(savedWeeklySchedule.tuesday.startTime.toISOString()).toBe('1970-01-31T16:00:00.000Z');
      expect(savedWeeklySchedule.tuesday.endTime.toISOString()).toBe('1970-02-01T01:00:00.000Z');
    });
  });
});
