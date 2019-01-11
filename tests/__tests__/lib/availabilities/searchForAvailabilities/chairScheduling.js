
import moment from 'moment';
import { v4 as uuid } from 'uuid';
import {
  Account,
  Appointment,
  Chair,
  DailySchedule,
  Practitioner,
  PractitionerRecurringTimeOff,
  Service,
  WeeklySchedule,
} from 'CareCruModels';
import { wipeAllModels } from '../../../../util/wipeModel';
import {
  seedTestAvailabilities,
  chairId,
  accountId,
  serviceId,
  practitionerId,
  practitionerId2,
} from '../../../../util/seedTestAvailabilities';
import searchForAvailabilities from '../../../../../server/lib/availabilities/searchForAvailabilities';
import { saveWeeklyScheduleWithDefaults } from '../../../../../server/_models/WeeklySchedule';

const TZ = 'America/Vancouver';
const chairId2 = uuid();

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
    describe('Integration Tests - Chair Scheduling', () => {
      let appointments;
      let officeHours;
      let customWeeklySchedule1;
      let customWeeklySchedule2;
      let ws1;
      let ws2;
      let ws3;
      beforeEach(async () => {
        await Chair.create({
          id: chairId2,
          accountId,
          name: 'Chair 2',
        });

        appointments = await Appointment.bulkCreate([
          appt({
            startDate: iso('08:00', '03-05'), // Monday
            endDate: iso('09:00', '03-05'), // Monday
          }),
          appt({
            practitionerId: practitionerId2,
            startDate: iso('09:00', '03-05'), // Monday
            endDate: iso('10:00', '03-05'), // Monday
          }),
          appt({
            startDate: iso('10:00', '03-05'), // Monday
            endDate: iso('11:00', '03-05'), // Monday
          }),
          appt({
            practitionerId: practitionerId2,
            startDate: iso('11:00', '03-05'), // Monday
            endDate: iso('12:00', '03-05'), // Monday
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
            chairIds: [chairId],
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
            startTime: iso('08:00'),
            endTime: iso('18:00'),
            chairIds: [chairId2],
          },

          tuesday: {
            isClosed: false,
            startTime: iso('09:00'),
            endTime: iso('18:00'),
          },
        });

        // This needs to be like this because Promise.all breaks it with too many clients
        ws1 = await saveWeeklyScheduleWithDefaults(officeHours, WeeklySchedule);
        ws2 = await saveWeeklyScheduleWithDefaults(customWeeklySchedule1, WeeklySchedule);
        ws3 = await saveWeeklyScheduleWithDefaults(customWeeklySchedule2, WeeklySchedule);

        await Account.update(
          {
            weeklyScheduleId: ws1.id,
            timeInterval: 60,
          },
          { where: { id: accountId } },
        );

        await Practitioner.update(
          {
            isCustomSchedule: true,
            weeklyScheduleId: ws2.id,
          },
          { where: { id: practitionerId } },
        );

        await Practitioner.update(
          {
            isCustomSchedule: true,
            weeklyScheduleId: ws3.id,
          },
          { where: { id: practitionerId2 } },
        );

        await Service.update(
          { duration: 60 },
          { where: { id: serviceId } },
        );
      });

      test('should return 0 availabilities if chair1 is full', async () => {
        const startDate = iso('08:00', '03-05'); // Monday 8am
        const endDate = iso('12:00', '03-05'); // Monday 12pm
        const options = {
          accountId,
          serviceId,
          practitionerId,
          startDate,
          endDate,
          maxRetryAttempts: 0,
        };

        const { availabilities } = await searchForAvailabilities(options);
        expect(availabilities.length).toBe(0);
      });

      test('should return 2 availabilities if chair2 has nothing because of the default preferences', async () => {
        const startDate = iso('08:00', '03-05'); // Monday 8am
        const endDate = iso('12:00', '03-05'); // Monday 12pm
        const options = {
          accountId,
          serviceId,
          practitionerId: practitionerId2,
          startDate,
          endDate,
          maxRetryAttempts: 0,
        };

        const { availabilities } = await searchForAvailabilities(options);
        expect(availabilities.length).toBe(2);
      });

      test('should still return 0 availabilities even though we added chair2 to practitioner1', async () => {
        await DailySchedule.update({
          // Need to add this because its required to update a DailySchedule or else the getter breaks
          startTime: ws2.monday.startTime,
          endTime: ws2.monday.endTime,
          chairIds: [chairId, chairId2],
        }, { where: { id: ws2.monday.id } });

        const startDate = iso('08:00', '03-05'); // Monday 8am
        const endDate = iso('12:00', '03-05'); // Monday 12pm
        const options = {
          accountId,
          serviceId,
          practitionerId,
          startDate,
          endDate,
          maxRetryAttempts: 0,
        };

        const { availabilities } = await searchForAvailabilities(options);
        expect(availabilities.length).toBe(0);
      });

      test('should return 0 availabilities for practitioner2 because we added 2 appts to chair2', async () => {
        await Appointment.bulkCreate([
          appt({
            chairId: chairId2,
            practitionerId: practitionerId2,
            startDate: iso('08:00', '03-05'), // Monday
            endDate: iso('09:00', '03-05'), // Monday
          }),
          appt({
            chairId: chairId2,
            practitionerId: practitionerId2,
            startDate: iso('10:00', '03-05'), // Monday
            endDate: iso('11:00', '03-05'), // Monday
          }),
        ]);

        const startDate = iso('08:00', '03-05'); // Monday 8am
        const endDate = iso('12:00', '03-05'); // Monday 12pm
        const options = {
          accountId,
          serviceId,
          practitionerId: practitionerId2,
          startDate,
          endDate,
          maxRetryAttempts: 0,
        };

        const { availabilities } = await searchForAvailabilities(options);
        expect(availabilities.length).toBe(0);
      });

      test('should return 2 availabilities for practitioner1 if chairIds = []', async () => {
        await DailySchedule.update({
          // Need to add this because its required to update a DailySchedule or else the getter breaks
          startTime: ws2.monday.startTime,
          endTime: ws2.monday.endTime,
          chairIds: [],
        }, { where: { id: ws2.monday.id } });

        const startDate = iso('08:00', '03-05'); // Monday 8am
        const endDate = iso('12:00', '03-05'); // Monday 12pm
        const options = {
          accountId,
          serviceId,
          practitionerId,
          startDate,
          endDate,
          maxRetryAttempts: 0,
        };

        const { availabilities } = await searchForAvailabilities(options);
        expect(availabilities.length).toBe(2);
      });
    });
  });
});
