
import { WeeklySchedule } from '../../../server/_models';
import { omitProperties }  from '../../util/selectors';
import { wipeModelSequelize }  from '../../util/wipeModel';

describe('models/WeeklySchedule', () => {
  beforeEach(async () => {
    await wipeModelSequelize(WeeklySchedule);
  });

  afterAll(async () => {
    await wipeModelSequelize(WeeklySchedule);
  });

  describe('Data Validation', () => {
    test('should be able to save a WeeklySchedule without id provided', async () => {
      const weeklySchedule = await WeeklySchedule.create({});
      expect(omitProperties(weeklySchedule.get({ plain: true }), ['id'])).toMatchSnapshot();
    });

    test('should have null values for startDate', async () => {
      const weeklySchedule = await WeeklySchedule.create({});
      expect(weeklySchedule.startDate).toBe(null);
    });
  });
});
