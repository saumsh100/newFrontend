
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { Appointment, Account, DailySchedule, WeeklySchedule, Practitioner, PractitionerRecurringTimeOff } from '../../../../server/_models';
import {
  recurringTimeOffsFilter,
  practitionersTimeOffHours,
  practitionersTotalHours,
  getPractitionerData,
} from '../../../../server/lib/intelligence/practitioner';
import wipeModel, { wipeAllModels } from '../../../util/wipeModel';
import { accountId, enterpriseId, seedTestUsers, wipeTestUsers } from '../../../util/seedTestUsers';
import { wipeTestPatients, patientId } from '../../../util/seedTestPatients';
import { wipeTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';
import { appointment, appointmentId, seedTestAppointments } from '../../../util/seedTestAppointments';
import { weeklyScheduleId, seedTestWeeklySchedules } from '../../../util/seedTestWeeklySchedules';


const timeOffs = [{
  id: '086f26fa-19e5-41b4-b988-8a41d102d136',
  startDate: '2016-08-01T07:00:00.000Z',
  endDate: '2018-02-03T08:00:00.000Z',
  startTime: '1970-01-31T10:00:00.000Z',
  endTime: '1970-02-01T02:00:00.000Z',
  interval: 1,
  allDay: true,
  fromPMS: false,
  pmsId: null,
  dayOfWeek: 'Monday',
  note: '',
  createdAt: '2017-11-07T18:42:41.685Z',
  updatedAt: '2017-11-08T00:26:54.461Z',
  deletedAt: null,
  practitionerId: '82982076-6823-4da9-b962-3771ef588b94',
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
  note: '',
  createdAt: '2017-11-07T22:03:54.314Z',
  updatedAt: '2017-11-07T22:35:04.200Z',
  deletedAt: null,
  practitionerId: '82982076-6823-4da9-b962-3771ef588b94',
}];

const timeOffsPostProcess = [
  {
    allDay: true,
    endDate: '2017-11-06T08:00:00.000Z',
    practitionerId: '82982076-6823-4da9-b962-3771ef588b94',
    startDate: '2017-11-06T08:00:00.000Z',
  },
  {
    allDay: false,
    createdAt: '2017-11-07T22:03:54.314Z',
    dayOfWeek: null,
    deletedAt: null,
    endDate: '2017-11-12T01:00:00.000Z',
    endTime: null,
    fromPMS: false,
    id: '98007dec-656a-4f10-8500-054760add731',
    interval: null,
    note: '',
    pmsId: null,
    practitionerId: '82982076-6823-4da9-b962-3771ef588b94',
    startDate: '2017-10-23T22:00:00.000Z',
    startTime: null,
    updatedAt: '2017-11-07T22:35:04.200Z',
  },
];

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

const practitioner = {
  fullAvatarUrl: null,
  id: '4f439ff8-c55d-4423-9316-a41240c4d329',
  accountId: '1aeab035-b72c-4f7a-ad73-09465cbf5654',
  pmsId: null,
  type: 'Hygienist',
  isActive: true,
  isHidden: false,
  firstName: 'Chelsea',
  lastName: 'Handler',
  avatarUrl: null,
  isCustomSchedule: true,
  weeklyScheduleId: '39b9ed42-b82b-4fb5-be5e-9dfded032bdf',
  createdAt: '2018-04-02T21:38:33.880Z',
  updatedAt: '2018-04-02T21:38:33.880Z',
  deletedAt: null,
};

describe('Intelligence - Practitioner', () => {
  describe('Practitioner', () => {
    describe('#recurringTimeOffsFilter', () => {
      test('convert all timeoffs (including recurring time offs) to regular time offs', async () => {
        const body = await recurringTimeOffsFilter(timeOffs, new Date(2017, 10, 1).toISOString(), new Date(2017, 10, 8).toISOString());
        expect(body).toMatchSnapshot();
      });

    });

    describe('#practitionersTimeOffHours', () => {
      test('Calculate amount of time offs in hours', async () => {
        const body = await practitionersTimeOffHours(schedule, timeOffsPostProcess, new Date(2017, 10, 1).toISOString(), new Date(2017, 10, 30).toISOString());
        expect(body).toBe(30);
      });
    });

    describe('#practitionersTotalHours', () => {
      test('practitionersTotalHours - no repeat schedule', async () => {
        const body = await practitionersTotalHours(schedule, new Date(2017, 10, 1).toISOString(), new Date(2017, 11, 5).toISOString());
        expect(Math.round(body)).toBe(296);
      });

      test('practitionersTotalHours - repeat schedule - with extra days', async () => {
        const body = await practitionersTotalHours(scheduleRepeat, new Date(2017, 10, 1).toISOString(), new Date(2017, 11, 12).toISOString());
        expect(Math.round(body)).toBe(288);
      });

      test('practitionersTotalHours - repeat schedule', async () => {
        const body = await practitionersTotalHours(scheduleRepeat, new Date(2017, 10, 1).toISOString(), new Date(2017, 11, 13).toISOString());
        expect(Math.round(body)).toBe(303);
      });
    });

    describe('#getPractitionerData', () => {
      beforeEach(async () => {
        await wipeModel(DailySchedule);
        await seedTestUsers();
        await seedTestAppointments();
        await Account.update({ weeklyScheduleId }, { where: { id: accountId } }).catch(err => console.log(err));

        const practitionerCopy = JSON.parse(JSON.stringify(practitioner));
        practitionerCopy.accountId = accountId;

        const scheduleCopy = JSON.parse(JSON.stringify(schedule));

        practitionerCopy.weeklyScheduleId = scheduleCopy.id;

        await WeeklySchedule.create(scheduleCopy);
        await Practitioner.create(practitionerCopy);
      });

      afterEach(async () => {
        await wipeModel(DailySchedule);
        await wipeModel(PractitionerRecurringTimeOff);
        await wipeTestUsers();
        await wipeModel(Account);
        await wipeModel(WeeklySchedule);
        await wipeModel(Appointment);
        await wipeTestPatients();
        await wipeTestPractitioners();
        await wipeAllModels();
      });

      test('should return practitioner with their schedule as the practitioner has a custom schedule', async () => {
        const body = await getPractitionerData(practitioner.id, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');

        expect(body.weeklySchedule.id).toBe('6cc033e5-927e-4abe-8127-d805c074b531');
      });

      test('should return practitioner with the account\'s schedule as the practitioner doesn\'t have a custom schedule', async () => {
        await Practitioner.update({ isCustomSchedule: false }, { where: { id: practitioner.id } });
        const body = await getPractitionerData(practitioner.id, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');

        expect(body.weeklySchedule.id).toBe('8ce3ba61-60cd-40c6-bc85-c018cabd4a40');
      });

      test('should return daily schedule as it is within the range', async () => {
        const dailySchedule = JSON.parse(JSON.stringify(dailySchedules[0]));
        dailySchedule.date = '2018-04-03';
        await DailySchedule.create(dailySchedule);
        const body = await getPractitionerData(practitioner.id, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');

        expect(body.dailySchedules[0].id).toBe('c19c17fd-7cb8-4e2c-9290-a092b95e9014');
      });

      test('should return not daily schedule as it is not within the range', async () => {
        const dailySchedule = JSON.parse(JSON.stringify(dailySchedules[0]));
        dailySchedule.date = '2018-04-01';
        await DailySchedule.create(dailySchedule);
        const body = await getPractitionerData(practitioner.id, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');

        expect(body.dailySchedules[0]).toBeUndefined();
      });

      test('should return timeoff as the end date is in range', async () => {
        const dailySchedule = JSON.parse(JSON.stringify(dailySchedules[0]));
        dailySchedule.date = '2018-04-01';
        await DailySchedule.create(dailySchedule);

        const timeOff = {
          startDate: '2018-04-02T16:00:00.000Z',
          endDate: '2018-04-06T01:00:00.000Z',
          practitionerId: practitioner.id,
          allDay: true,
        };

        await PractitionerRecurringTimeOff.create(timeOff);

        const body = await getPractitionerData(practitioner.id, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');

        expect(body.recurringTimeOffs).toHaveLength(1);
      });

      test('should return timeoff as time off covers the hole range', async () => {
        const dailySchedule = JSON.parse(JSON.stringify(dailySchedules[0]));
        dailySchedule.date = '2018-04-01';
        await DailySchedule.create(dailySchedule);

        const timeOff = {
          startDate: '2018-04-02T16:00:00.000Z',
          endDate: '2018-04-22T01:00:00.000Z',
          practitionerId: practitioner.id,
          allDay: true,
        };

        await PractitionerRecurringTimeOff.create(timeOff);

        const body = await getPractitionerData(practitioner.id, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');

        expect(body.recurringTimeOffs).toHaveLength(1);
      });

      test('should return timeoff as the start date is in range', async () => {
        const dailySchedule = JSON.parse(JSON.stringify(dailySchedules[0]));
        dailySchedule.date = '2018-04-01';
        await DailySchedule.create(dailySchedule);

        const timeOff = {
          startDate: '2018-04-04T16:00:00.000Z',
          endDate: '2018-04-22T01:00:00.000Z',
          practitionerId: practitioner.id,
          allDay: true,
        };

        await PractitionerRecurringTimeOff.create(timeOff);

        const body = await getPractitionerData(practitioner.id, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');

        expect(body.recurringTimeOffs).toHaveLength(1);
      });

      test('should not return timeoff as it\'s after the the range', async () => {
        const dailySchedule = JSON.parse(JSON.stringify(dailySchedules[0]));
        dailySchedule.date = '2018-04-01';
        await DailySchedule.create(dailySchedule);

        const timeOff = {
          startDate: '2018-04-22T00:00:00.000Z',
          endDate: '2018-04-22T01:00:00.000Z',
          practitionerId: practitioner.id,
          allDay: true,
        };

        await PractitionerRecurringTimeOff.create(timeOff);

        const body = await getPractitionerData(practitioner.id, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');

        expect(body.recurringTimeOffs).toHaveLength(0);
      });

      test('should not return timeoff as it\'s before the the range', async () => {
        const dailySchedule = JSON.parse(JSON.stringify(dailySchedules[0]));
        dailySchedule.date = '2018-04-01';
        await DailySchedule.create(dailySchedule);

        const timeOff = {
          startDate: '2018-04-01T00:00:00.000Z',
          endDate: '2018-04-01T01:00:00.000Z',
          practitionerId: practitioner.id,
          allDay: true,
        };

        await PractitionerRecurringTimeOff.create(timeOff);

        const body = await getPractitionerData(practitioner.id, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');

        expect(body.recurringTimeOffs).toHaveLength(0);
      });
    });
  });
});
