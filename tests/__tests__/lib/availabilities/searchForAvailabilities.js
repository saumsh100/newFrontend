
import moment from 'moment';
import {
  Account,
  Appointment,
  DailySchedule,
  Practitioner,
  PractitionerRecurringTimeOff,
  Service,
  WeeklySchedule,
} from 'CareCruModels';
import { wipeAllModels } from '../../../util/wipeModel';
import {
  seedTestAvailabilities,
  chairId,
  accountId,
  serviceId,
  practitionerId,
  practitionerId2,
} from '../../../util/seedTestAvailabilities';
import searchForAvailabilities from '../../../../server/lib/availabilities/searchForAvailabilities';
import { saveWeeklyScheduleWithDefaults } from '../../../../server/_models/WeeklySchedule';

const TZ = 'America/Vancouver';

const appt = data => ({
  practitionerId,
  chairId,
  accountId,
  ...data,
});

const generateWeeklySchedule = data => Object.assign(
  {},
  {
    monday: { isClosed: true },
    tuesday: { isClosed: true },
    wednesday: { isClosed: true },
    thursday: { isClosed: true },
    friday: { isClosed: true },
    saturday: { isClosed: true },
    sunday: { isClosed: true },
  },
  data,
);

const openDay = () => ({
  isClosed: false,
  startTime: iso('01:00'),
  endTime: iso('23:00'),
});

const generateTimeOff = (data = {}) => ({
  allDay: true,
  ...data,
});

const generateDailySchedule = (data = {}) => ({
  accountId,
  isClosed: true,
  startTime: iso('08:00'),
  endTime: iso('08:00'),
  ...data,
});


const iso = (time, day = '03-08', tz = TZ) => moment.tz(`2018-${day} ${time}:00`, tz).toISOString();

describe('Availabilities Library', () => {
  beforeEach(async () => {
    await seedTestAvailabilities();
  });

  afterEach(async () => {
    await wipeAllModels();
  });

  describe('#searchForAvailabilities', () => {
    test('should be a function', () => {
      expect(typeof searchForAvailabilities).toBe('function');
    });

    describe('seedTestAvailabilities Data', () => {
      test('should return 0 availabilities', async () => {
        const startDate = (new Date()).toISOString();
        const endDate = (new Date()).toISOString();

        const options = {
          accountId,
          practitionerId,
          serviceId,
          startDate,
          endDate,
        };

        const { availabilities } = await searchForAvailabilities(options);
        expect(Array.isArray(availabilities)).toBe(true);
        expect(availabilities.length).toBe(0);
      });

      test('should return 0 availabilities - max retryAttempts', async () => {
        const startDate = (new Date()).toISOString();
        const endDate = (new Date()).toISOString();

        const options = {
          accountId,
          practitionerId,
          serviceId,
          startDate,
          maxRetryAttempts: 8,
          numBumpDays: 0,
          endDate,
        };

        const {
          availabilities,
          retryAttempts,
          nextAvailability,
        } = await searchForAvailabilities(options);
        expect(Array.isArray(availabilities)).toBe(true);
        expect(availabilities.length).toBe(0);
        expect(nextAvailability).toBe(null);
        expect(retryAttempts).toBe(8);
      });

      test('should return 0 availabilities - max retryAttempts', async () => {
        const startDate = (new Date()).toISOString();
        const endDate = (new Date()).toISOString();

        const options = {
          accountId,
          practitionerId,
          serviceId,
          startDate,
          maxRetryAttempts: 8,
          numBumpDays: 0,
          endDate,
        };

        const {
          availabilities,
          retryAttempts,
          nextAvailability,
        } = await searchForAvailabilities(options);
        expect(Array.isArray(availabilities)).toBe(true);
        expect(availabilities.length).toBe(0);
        expect(nextAvailability).toBe(null);
        expect(retryAttempts).toBe(8);
      });

      test('should return 0 availabilites (seedData just appointments)', async () => {
        const startDate = moment.tz('2018-03-03 08:00:00', 'America/Vancouver').toISOString();
        const endDate = moment.tz('2018-03-03 12:00:00', 'America/Vancouver').toISOString();

        const options = {
          accountId,
          practitionerId,
          serviceId,
          startDate,
          maxRetryAttempts: 0,
          endDate,
        };

        const { availabilities, retryAttempts } = await searchForAvailabilities(options);

        expect(retryAttempts).toBe(0);
        expect(Array.isArray(availabilities)).toBe(true);
        expect(availabilities.length).toBe(0);
      });
    });

    describe('Integration Tests - General Scenario', () => {
      let appointments;
      let officeHours;
      let customWeeklySchedule1;
      let customWeeklySchedule2;
      beforeEach(async () => {
        // Add WeeklySchedule to Account
        // Add custom WeeklySchedule to practitioner
        appointments = await Appointment.bulkCreate([
          appt({
            startDate: iso('08:45', '03-05'), // Monday
            endDate: iso('09:00', '03-05'), // Monday
          }),
          appt({
            startDate: iso('09:00', '03-05'), // Monday
            endDate: iso('10:00', '03-05'), // Monday
          }),
          appt({
            startDate: iso('10:00', '03-05'), // Monday
            endDate: iso('11:30', '03-05'), // Monday
          }),
          appt({
            startDate: iso('07:30', '03-06'), // Tuesday
            endDate: iso('10:00', '03-06'), // Tuesday
          }),
          appt({
            startDate: iso('10:00', '03-06'), // Tuesday
            endDate: iso('12:30', '03-06'), // Tuesday
          }),
          appt({
            startDate: iso('12:30', '03-06'), // Tuesday
            endDate: iso('15:00', '03-06'), // Tuesday
          }),
          appt({
            startDate: iso('15:00', '03-06'), // Tuesday
            endDate: iso('18:30', '03-06'), // Tuesday
          }),
          appt({
            startDate: iso('14:00', '03-07'), // Wednesday
            endDate: iso('15:00', '03-07'), // Wednesday
          }),
          appt({
            startDate: iso('16:00', '03-07'), // Wednesday
            endDate: iso('16:30', '03-07'), // Wednesday
          }),
          appt({
            startDate: iso('17:00', '03-07'), // Wednesday
            endDate: iso('18:00', '03-07'), // Wednesday
          }),
          appt({
            startDate: iso('18:00', '03-07'), // Wednesday
            endDate: iso('19:00', '03-07'), // Wednesday
          }),
          appt({
            practitionerId: practitionerId2,
            startDate: iso('09:00', '03-05'), // Monday
            endDate: iso('10:00', '03-05'), // Monday
          }),
          appt({
            practitionerId: practitionerId2,
            startDate: iso('10:00', '03-05'), // Monday
            endDate: iso('11:00', '03-05'), // Monday
          }),
          appt({
            practitionerId: practitionerId2,
            startDate: iso('11:00', '03-05'), // Monday
            endDate: iso('12:00', '03-05'), // Monday
          }),
          appt({
            practitionerId: practitionerId2,
            startDate: iso('12:00', '03-05'), // Monday
            endDate: iso('13:00', '03-05'), // Monday
          }),
          appt({
            practitionerId: practitionerId2,
            startDate: iso('13:00', '03-06'), // Tuesday
            endDate: iso('14:00', '03-06'), // Tuesday
          }),
          appt({
            practitionerId: practitionerId2,
            startDate: iso('14:00', '03-06'), // Tuesday
            endDate: iso('15:00', '03-06'), // Tuesday
          }),
          appt({
            practitionerId: practitionerId2,
            startDate: iso('15:00', '03-06'), // Tuesday
            endDate: iso('16:00', '03-06'), // Tuesday
          }),
          appt({
            practitionerId: practitionerId2,
            startDate: iso('16:00', '03-06'), // Tuesday
            endDate: iso('17:00', '03-06'), // Tuesday
          }),
          appt({
            practitionerId: practitionerId2,
            startDate: iso('17:00', '03-06'), // Tuesday
            endDate: iso('18:00', '03-06'), // Tuesday
          }),
        ]);

        officeHours = generateWeeklySchedule({
          monday: openDay(),
          tuesday: openDay(),
          wednesday: openDay(),
          thursday: openDay(),
          friday: openDay(),
          saturday: openDay(),
          sunday: openDay(),
        });

        customWeeklySchedule1 = generateWeeklySchedule({
          monday: {
            isClosed: false,
            startTime: iso('08:00'),
            endTime: iso('17:00'),
            breaks: [
              {
                startTime: iso('12:00'),
                endTime: iso('13:00'),
              },
            ],
          },

          tuesday: {
            isClosed: false,
            startTime: iso('08:00'),
            endTime: iso('17:00'),
            breaks: [
              {
                startTime: iso('12:00'),
                endTime: iso('13:00'),
              },
            ],
          },

          wednesday: {
            isClosed: false,
            startTime: iso('13:00'),
            endTime: iso('21:00'),
          },
        });

        customWeeklySchedule2 = generateWeeklySchedule({
          monday: {
            isClosed: false,
            startTime: iso('09:00'),
            endTime: iso('18:00'),
          },

          tuesday: {
            isClosed: false,
            startTime: iso('09:00'),
            endTime: iso('18:00'),
          },
        });

        // This needs to be like this because Promise.all breaks it with too many clients
        const ws1 = await saveWeeklyScheduleWithDefaults(officeHours ,WeeklySchedule);
        const ws2 = await saveWeeklyScheduleWithDefaults(customWeeklySchedule1 ,WeeklySchedule);
        const ws3 = await saveWeeklyScheduleWithDefaults(customWeeklySchedule2 ,WeeklySchedule);
        const weeklySchedules = [ws1, ws2, ws3];

        await Account.update(
          {
            weeklyScheduleId: weeklySchedules[0].id,
            timeInterval: 60,
          },
          { where: { id: accountId } },
        );

        await Practitioner.update(
          {
            isCustomSchedule: true,
            weeklyScheduleId: weeklySchedules[1].id,
          },
          { where: { id: practitionerId } },
        );

        await Practitioner.update(
          {
            isCustomSchedule: true,
            weeklyScheduleId: weeklySchedules[2].id,
          },
          { where: { id: practitionerId2 } },
        );

        await Service.update(
          { duration: 120 },
          { where: { id: serviceId } },
        );
      });

      test('should return 8 availabilities with scenario above', async () => {
        const startDate = iso('06:00', '03-05'); // Monday morning
        const endDate = iso('18:00', '03-08'); // Thursday evening
        const options = {
          accountId,
          serviceId,
          startDate,
          maxRetryAttempts: 5,
          endDate,
        };

        const { availabilities, retryAttempts } = await searchForAvailabilities(options);
        expect(retryAttempts).toBe(0);
        expect(Array.isArray(availabilities)).toBeTruthy();
        expect(availabilities.length).toBe(8);
      });

      test('should retry 3 times and have a nextAvailability of the monday', async () => {
        const toStart = iso('06:00', '03-05');
        const toEnd = iso('06:00', '03-25');
        await PractitionerRecurringTimeOff.bulkCreate([
          generateTimeOff({ practitionerId, startDate: toStart, endDate: toEnd }),
          generateTimeOff({ practitionerId: practitionerId2, startDate: toStart, endDate: toEnd }),
        ]);

        const startDate = iso('06:00', '03-05'); // Monday morning
        const endDate = iso('18:00', '03-08'); // Thursday evening
        const options = {
          accountId,
          serviceId,
          startDate,
          maxRetryAttempts: 5,
          numDaysJump: 7,
          endDate,
        };

        const { availabilities, nextAvailability, retryAttempts } = await searchForAvailabilities(options);
        expect(retryAttempts).toBe(3);
        expect(Array.isArray(availabilities)).toBe(true);
        expect(availabilities.length).toBe(0);

        // Its not 8:00am anymore cause the Daylight Savings Time takes place on March 11th
        expect(nextAvailability.startDate).toBe(iso('08:00', '03-26'));
      });

      test('should retry 2 times and have same nextAvailability as above', async () => {
        const toStart = iso('06:00', '03-05');
        const toEnd = iso('06:00', '03-25');
        await PractitionerRecurringTimeOff.bulkCreate([
          generateTimeOff({ practitionerId, startDate: toStart, endDate: toEnd }),
          generateTimeOff({ practitionerId: practitionerId2, startDate: toStart, endDate: toEnd }),
        ]);

        const startDate = iso('06:00', '03-05'); // Monday morning
        const endDate = iso('18:00', '03-08'); // Thursday evening
        const options = {
          accountId,
          serviceId,
          startDate,
          maxRetryAttempts: 5,
          numDaysJump: 10,
          endDate,
        };

        const { availabilities, nextAvailability, retryAttempts } = await searchForAvailabilities(options);
        expect(retryAttempts).toBe(2);
        expect(Array.isArray(availabilities)).toBe(true);
        expect(availabilities.length).toBe(0);

        // Its not 8:00am anymore cause the Daylight Savings Time takes place on March 11th
        expect(nextAvailability.startDate).toBe(iso('08:00', '03-26'));
      });

      test('should retry 5 times which is the max and have nextAvailability=null', async () => {
        const toStart = iso('06:00', '03-05');
        const toEnd = iso('06:00', '04-25');
        await PractitionerRecurringTimeOff.bulkCreate([
          generateTimeOff({ practitionerId, startDate: toStart, endDate: toEnd }),
          generateTimeOff({ practitionerId: practitionerId2, startDate: toStart, endDate: toEnd }),
        ]);

        const startDate = iso('06:00', '03-05'); // Monday morning
        const endDate = iso('18:00', '03-08'); // Thursday evening
        const options = {
          accountId,
          serviceId,
          startDate,
          maxRetryAttempts: 5,
          numDaysJump: 7,
          endDate,
        };

        const { availabilities, nextAvailability, retryAttempts } = await searchForAvailabilities(options);
        expect(retryAttempts).toBe(5);
        expect(Array.isArray(availabilities)).toBe(true);
        expect(availabilities.length).toBe(0);
        expect(nextAvailability).toBe(null);
      });

      test('should return 5 availabilities for Jennifer', async () => {
        const startDate = iso('15:00', '03-05'); // Monday afternoon
        const endDate = iso('18:00', '03-08'); // Thursday evening

        const options = {
          accountId,
          practitionerId: practitionerId2,
          serviceId,
          startDate,
          maxRetryAttempts: 5,
          endDate,
        };

        const { availabilities, retryAttempts } = await searchForAvailabilities(options);

        expect(retryAttempts).toBe(0);
        expect(Array.isArray(availabilities)).toBe(true);
        expect(availabilities.length).toBe(5);
      });

      test('should return 3 availabilities if first day is off', async () => {
        const startDate = iso('15:00', '03-05'); // Monday afternoon
        const endDate = iso('18:00', '03-08'); // Thursday evening

        const toStart = iso('06:00', '03-05');
        const toEnd = iso('06:00', '03-05');
        await PractitionerRecurringTimeOff.bulkCreate([
          generateTimeOff({ practitionerId: practitionerId2, startDate: toStart, endDate: toEnd }),
        ]);

        const options = {
          accountId,
          practitionerId: practitionerId2,
          serviceId,
          startDate,
          maxRetryAttempts: 5,
          endDate,
        };

        const { availabilities, retryAttempts } = await searchForAvailabilities(options);

        expect(retryAttempts).toBe(0);
        expect(Array.isArray(availabilities)).toBe(true);
        expect(availabilities.length).toBe(3);
      });

      test('should return 0 availabilities with blocked off OfficeHours', async () => {
        const startDate = iso('06:00', '03-05'); // Monday morning
        const endDate = iso('18:00', '03-08'); // Thursday evening
        const options = {
          accountId,
          serviceId,
          startDate,
          maxRetryAttempts: 0,
          endDate,
        };

        await DailySchedule.bulkCreate([
          generateDailySchedule({ date: '2018-03-05' }),
          generateDailySchedule({ date: '2018-03-06' }),
          generateDailySchedule({ date: '2018-03-07' }),
          generateDailySchedule({ date: '2018-03-08' }),
        ]);

        const { availabilities, retryAttempts } = await searchForAvailabilities(options);
        expect(retryAttempts).toBe(0);
        expect(Array.isArray(availabilities)).toBeTruthy();
        expect(availabilities.length).toBe(0);
      });

      test('should return 7 availabilities with adjusted starTime due to OfficeHours', async () => {
        const startDate = iso('06:00', '03-05'); // Monday morning
        const endDate = iso('18:00', '03-08'); // Thursday evening
        const options = {
          accountId,
          serviceId,
          startDate,
          maxRetryAttempts: 0,
          endDate,
        };

        // Block off the morning till 2pm... reduces the first testcase to 7 availabilities
        await DailySchedule.create(generateDailySchedule({
          date: '2018-03-05',
          startTime: iso('14:00'),
          endTime: iso('18:00'),
        }));

        const { availabilities, retryAttempts } = await searchForAvailabilities(options);
        expect(retryAttempts).toBe(0);
        expect(Array.isArray(availabilities)).toBeTruthy();
        expect(availabilities.length).toBe(7);
      });
    });
  });
});
