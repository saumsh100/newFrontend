
import moment from 'moment';
import {
  Account,
  Appointment,
  Practitioner,
  PractitionerRecurringTimeOff,
  Service,
  WeeklySchedule,
} from '../../../../server/_models';
import { seedTestAvailabilities } from '../../../util/seedTestAvailabilities';
import { wipeAllModels } from '../../../util/wipeModel';
import searchForAvailabilities from '../../../../server/lib/availabilities/searchForAvailabilities';
import { printPractitionersData } from '../../../../server/lib/availabilities/helpers/print';

const TZ = 'America/Vancouver';

// Sunshine Smiles Dental (timeInterval = 30, gets changed to 60 at bottom)
const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';

// Cleanup Service (duration = 60)
const serviceId = '5f439ff8-c55d-4423-9316-a41240c4d329';

// Chelsea Handler
const practitionerId = '4f439ff8-c55d-4423-9316-a41240c4d329';

const appt = data => Object.assign(
  {},
  { accountId },
  data,
);

// Jennifer Love-Hewitt
const practitionerId2 = '721fb9c1-1195-463f-9137-42c52d0707ab';

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

const generateTimeOff = data => Object.assign(
  {},
  { allDay: true },
  data,
);

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

    describe('seedTestAvailabilities Data', () =>{
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

        const { availabilities, retryAttempts, nextAvailability } = await searchForAvailabilities(options);
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

        const { availabilities, retryAttempts, nextAvailability } = await searchForAvailabilities(options);
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
      let customWeeklySchedule;
      beforeEach(async () => {
        // Add WeeklySchedule to Account
        // Add custom WeeklySchedule to practitioner
        appointments = await Appointment.bulkCreate([
          appt({
            practitionerId,
            startDate: iso('08:45', '03-05'), // Monday
            endDate: iso('09:00', '03-05'), // Monday
          }),
          appt({
            practitionerId,
            startDate: iso('09:00', '03-05'), // Monday
            endDate: iso('10:00', '03-05'), // Monday
          }),
          appt({
            practitionerId,
            startDate: iso('10:00', '03-05'), // Monday
            endDate: iso('11:30', '03-05'), // Monday
          }),
          appt({
            practitionerId,
            startDate: iso('07:30', '03-06'), // Tuesday
            endDate: iso('10:00', '03-06'), // Tuesday
          }),
          appt({
            practitionerId,
            startDate: iso('10:00', '03-06'), // Tuesday
            endDate: iso('12:30', '03-06'), // Tuesday
          }),
          appt({
            practitionerId,
            startDate: iso('12:30', '03-06'), // Tuesday
            endDate: iso('15:00', '03-06'), // Tuesday
          }),
          appt({
            practitionerId,
            startDate: iso('15:00', '03-06'), // Tuesday
            endDate: iso('18:30', '03-06'), // Tuesday
          }),
          appt({
            practitionerId,
            startDate: iso('14:00', '03-07'), // Wednesday
            endDate: iso('15:00', '03-07'), // Wednesday
          }),
          appt({
            practitionerId,
            startDate: iso('16:00', '03-07'), // Wednesday
            endDate: iso('16:30', '03-07'), // Wednesday
          }),
          appt({
            practitionerId,
            startDate: iso('17:00', '03-07'), // Wednesday
            endDate: iso('18:00', '03-07'), // Wednesday
          }),
          appt({
            practitionerId,
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

        customWeeklySchedule = generateWeeklySchedule({
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

        const weeklySchedules = await WeeklySchedule.bulkCreate([
          officeHours,
          customWeeklySchedule,
        ]);

        await Account.update(
          { weeklyScheduleId: weeklySchedules[0].id, timeInterval: 60 },
          { where: { id: accountId } }
        );

        await Practitioner.update(
          { isCustomSchedule: true, weeklyScheduleId: weeklySchedules[1].id },
          { where: { id: practitionerId } }
        );

        await Service.update(
          { duration: 120 },
          { where: { id: serviceId } }
        );
      });

      test('should return 8 availabilites with scenario above', async () => {
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
        expect(Array.isArray(availabilities)).toBe(true);
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
    });
  });
});
