
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import { Appointment, Account, DailySchedule, WeeklySchedule, Practitioner, PractitionerRecurringTimeOff } from '../../../../server/_models';
import {
  mapDailySchedule,
  practitionerDailySchedule,
  getDailyScheduleObjects,
  getWeeklyScheduleFromAdvanced,
  modifyDailyScheduleWithTimeoffs,
} from '../../../../server/lib/availabilities/dailySchedule';
import wipeModel, { wipeAllModels } from '../../../util/wipeModel';
import { accountId, enterpriseId, seedTestUsers, wipeTestUsers } from '../../../util/seedTestUsers';
import { wipeTestPatients, patientId } from '../../../util/seedTestPatients';
import { wipeTestPractitioners, practitionerId } from '../../../util/seedTestPractitioners';
import { appointment, appointmentId, seedTestAppointments } from '../../../util/seedTestAppointments';
import { weeklyScheduleId, seedTestWeeklySchedules } from '../../../util/seedTestWeeklySchedules';


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

describe('Intelligence - Practitioner', () => {
  describe('Practitioner', () => {
    describe('#mapDailySchedule', () => {
      test('should map an array of daily schedule or an object with the date as a key', () => {
        const body = mapDailySchedule(dailySchedules);
        expect(typeof body).toBe('object');
        expect(body['2017-04-03']).toBe(dailySchedules[0]);
      });
    });

    describe('#getDailyScheduleObjects', () => {
      test('should return 20 daily schedules with a repeat', async () => {
        const copyPractitioner = JSON.parse(JSON.stringify(practitioner));
        copyPractitioner.dailySchedules = [];
        copyPractitioner.weeklySchedule = JSON.parse(JSON.stringify(scheduleRepeat));
        copyPractitioner.weeklySchedule.monday.startTime = '1970-01-31T16:00:00.000Z';
        const body = getDailyScheduleObjects(copyPractitioner, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');

        practitioner.dailySchedules = undefined;
        expect(typeof body).toBe('object');
        expect(Object.keys(body)).toHaveLength(20);
        expect(body['2018-04-02'].startTime).toBe('2018-04-02T16:00:00.000Z');
        expect(body['2018-04-09'].startTime).toBe('2018-04-09T18:00:00.000Z');
      });

      test('should return 20 daily schedules with a repeat and an overrride', async () => {
        const copyPractitioner = JSON.parse(JSON.stringify(practitioner));
        copyPractitioner.dailySchedules = JSON.parse(JSON.stringify(dailySchedules));
        copyPractitioner.dailySchedules[0].date = '2018-04-03';
        copyPractitioner.weeklySchedule = JSON.parse(JSON.stringify(scheduleRepeat));
        copyPractitioner.weeklySchedule.monday.startTime = '1970-01-31T16:00:00.000Z';
        const body = getDailyScheduleObjects(copyPractitioner, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');

        practitioner.dailySchedules = undefined;
        expect(typeof body).toBe('object');
        expect(Object.keys(body)).toHaveLength(20);
        expect(body['2018-04-02'].startTime).toBe('2018-04-02T16:00:00.000Z');
        expect(body['2018-04-03'].startTime).toBe('2018-04-04T01:00:00.000Z');
        expect(body['2018-04-09'].startTime).toBe('2018-04-09T18:00:00.000Z');
      });

      test('should return 20 daily schedules with a repeat and breaks', async () => {
        const copyPractitioner = JSON.parse(JSON.stringify(practitioner));
        copyPractitioner.dailySchedules = [];
        copyPractitioner.weeklySchedule = JSON.parse(JSON.stringify(scheduleRepeat));
        copyPractitioner.weeklySchedule.monday.startTime = '1970-01-31T16:00:00.000Z';

        const breaks = [{
          startTime: '1970-01-31T16:00:00.000Z',
          endTime: '1970-01-31T17:00:00.000Z',
        }];

        copyPractitioner.weeklySchedule.monday.breaks = breaks;

        const body = getDailyScheduleObjects(copyPractitioner, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');

        practitioner.dailySchedules = undefined;

        expect(typeof body).toBe('object');
        expect(Object.keys(body)).toHaveLength(20);
        expect(body['2018-04-02'].startTime).toBe('2018-04-02T16:00:00.000Z');
        expect(body['2018-04-09'].startTime).toBe('2018-04-09T18:00:00.000Z');
        expect(body['2018-04-02'].breaks[0].startTime).toBe('2018-04-02T16:00:00.000Z');
        expect(body['2018-04-02'].breaks[0].endTime).toBe('2018-04-02T17:00:00.000Z');
      });
    });

    describe('#getWeeklyScheduleFromAdvanced', () => {
      test('should return first in pattern when date is the same as the pattern startDate', () => {
        const body = getWeeklyScheduleFromAdvanced(scheduleRepeat, '2018-04-02T21:38:33.880Z');
        expect(body.monday.startTime).toBe('1970-01-31T15:00:00.000Z');
      });

      test('should return second in pattern when date is 7 days after the pattern startDate', () => {
        practitioner.dailySchedules = dailySchedules;
        const body = getWeeklyScheduleFromAdvanced(scheduleRepeat, '2018-04-09T21:38:33.880Z');
        expect(body.monday.startTime).toBe('1970-01-31T18:00:00.000Z');
      });

      test('should return first in pattern when date is 14 days the pattern startDate and there\'s only two weeks', () => {
        practitioner.dailySchedules = dailySchedules;
        const body = getWeeklyScheduleFromAdvanced(scheduleRepeat, '2018-04-16T21:38:33.880Z');
        expect(body.monday.startTime).toBe('1970-01-31T15:00:00.000Z');
      });
    });

    describe('#modifyDailyScheduleWithTimeoffs', () => {
      test('should return same daily schedule as time offs are not part of the schedule ', () => {
        const timeOffs = [{
          startDate: '2017-11-06T08:00:00.000Z',
          endDate: '2017-11-06T08:00:00.000Z',
          practitionerId: '82982076-6823-4da9-b962-3771ef588b94',
          allDay: true },
        { id: '98007dec-656a-4f10-8500-054760add731',
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
        },
        ];
        const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));

        const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');

        expect(JSON.stringify(dailySchedulesListCopy)).toBe(JSON.stringify(body));
      });

      test('should create a break as time off is in middle of day', () => {
        const timeOffs = [{
          startDate: '2018-04-04T16:00:00.000Z',
          endDate: '2018-04-04T17:00:00.000Z',
          practitionerId: '82982076-6823-4da9-b962-3771ef588b94',
          allDay: false },
        ];

        const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));

        const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');

        expect(body['2018-04-04'].breaks[0].startTime).toBe('2018-04-04T16:00:00.000Z');
        expect(body['2018-04-04'].breaks[0].endTime).toBe('2018-04-04T17:00:00.000Z');
      });

      test('should replace the endTime of schedule with the startDate of timeoff as the timeoff is for the rest of the day', () => {
        const timeOffs = [{
          startDate: '2018-04-04T16:00:00.000Z',
          endDate: '2018-04-05T01:00:00.000Z',
          practitionerId: '82982076-6823-4da9-b962-3771ef588b94',
          allDay: false },
        ];

        const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));

        const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');

        expect(body['2018-04-04'].startTime).toBe('2018-04-04T15:00:00.000Z');
        expect(body['2018-04-04'].endTime).toBe('2018-04-04T16:00:00.000Z');
      });

      test('should not change the schedule for day as the timeoff is outside range but same day', () => {
        const timeOffs = [{
          startDate: '2018-04-04T14:00:00.000Z',
          endDate: '2018-04-04T18:00:00.000Z',
          practitionerId: '82982076-6823-4da9-b962-3771ef588b94',
          allDay: false },
        ];

        const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));

        const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');

        expect(body['2018-04-04'].startTime).toBe('2018-04-04T18:00:00.000Z');
        expect(body['2018-04-04'].endTime).toBe('2018-04-04T23:50:00.000Z');
      });

      test('should remove the schedule for day as the timeoff is outside range and same day, but marked allDay', () => {
        const timeOffs = [{
          startDate: '2018-04-04T14:00:00.000Z',
          endDate: '2018-04-04T18:00:00.000Z',
          practitionerId: '82982076-6823-4da9-b962-3771ef588b94',
          allDay: true },
        ];

        const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));

        const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');

        expect(body['2018-04-04']).toBe(undefined);
        expect(Object.keys(body)).toHaveLength(3);
      });

      test('should remove the schedule for day as the timeoff encompasses the schedule', () => {
        const timeOffs = [{
          startDate: '2018-04-04T14:00:00.000Z',
          endDate: '2018-04-05T01:00:00.000Z',
          practitionerId: '82982076-6823-4da9-b962-3771ef588b94',
          allDay: false },
        ];

        const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));

        const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');

        expect(body['2018-04-04']).toBe(undefined);
        expect(Object.keys(body)).toHaveLength(3);
      });

      test('should change the endDate of 3 days and mark off one as the timeOffs goes for multiple days', () => {
        const timeOffs = [{
          startDate: '2018-04-02T16:00:00.000Z',
          endDate: '2018-04-06T01:00:00.000Z',
          practitionerId: '82982076-6823-4da9-b962-3771ef588b94',
          allDay: false },
        ];

        const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));

        const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');

        expect(body['2018-04-03'].startTime).toBe('2018-04-03T15:00:00.000Z');
        expect(body['2018-04-03'].endTime).toBe('2018-04-03T16:00:00.000Z');
        expect(body['2018-04-04'].startTime).toBe('2018-04-04T15:00:00.000Z');
        expect(body['2018-04-04'].endTime).toBe('2018-04-04T16:00:00.000Z');
        expect(body['2018-04-05'].startTime).toBe('2018-04-05T15:00:00.000Z');
        expect(body['2018-04-05'].endTime).toBe('2018-04-05T16:00:00.000Z');
        expect(Object.keys(body)).toHaveLength(3);
      });


      test('should mark off multiple days as the timeOffs goes for multiple days', () => {
        const timeOffs = [{
          startDate: '2018-04-02T16:00:00.000Z',
          endDate: '2018-04-06T01:00:00.000Z',
          practitionerId: '82982076-6823-4da9-b962-3771ef588b94',
          allDay: true },
        ];

        const dailySchedulesListCopy = JSON.parse(JSON.stringify(dailySchedulesList));

        const body = modifyDailyScheduleWithTimeoffs(dailySchedulesListCopy, timeOffs, 'America/Vancouver');
        expect(Object.keys(body)).toHaveLength(0);
      });
    });



    describe('#practitionerDailySchedule', () => {
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

      test('should return 2 daily schedules as the other 18 in the range are timeoffs', async () => {
        const dailySchedule = JSON.parse(JSON.stringify(dailySchedules[0]));
        dailySchedule.date = '2018-04-01';
        await DailySchedule.create(dailySchedule);

        const timeOff = {
          startDate: '2018-04-04T23:00:00.000Z',
          endDate: '2018-04-22T00:00:00.000Z',
          practitionerId: practitioner.id,
          allDay: true,
        };

        await PractitionerRecurringTimeOff.create(timeOff);

        const body = await practitionerDailySchedule(practitioner.id, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');
        expect(Object.keys(body)).toHaveLength(2);
      });

      test('should return 20 daily schedules and 18 with breaks as 18 in the range have timeoffs in middle of day', async () => {
        const dailySchedule = JSON.parse(JSON.stringify(dailySchedules[0]));
        dailySchedule.date = '2018-04-01';
        await DailySchedule.create(dailySchedule);

        const timeOff = {
          startDate: '2018-04-04T22:00:00.000Z',
          endDate: '2018-04-22T23:00:00.000Z',
          practitionerId: practitioner.id,
          allDay: false,
        };

        await PractitionerRecurringTimeOff.create(timeOff);

        const body = await practitionerDailySchedule(practitioner.id, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');

        expect(body['2018-04-04'].breaks[0].startTime).toBe('2018-04-04T22:00:00.000Z');
        expect(body['2018-04-04'].breaks[0].endTime).toBe('2018-04-04T23:00:00.000Z');
        expect(body['2018-04-05'].breaks[0].startTime).toBe('2018-04-05T22:00:00.000Z');
        expect(body['2018-04-05'].breaks[0].endTime).toBe('2018-04-05T23:00:00.000Z');
        expect(body['2018-04-06'].breaks[0].startTime).toBe('2018-04-06T22:00:00.000Z');
        expect(body['2018-04-06'].breaks[0].endTime).toBe('2018-04-06T23:00:00.000Z');
        expect(Object.keys(body)).toHaveLength(20);

        let breakCount = 0;

        Object.entries(body).forEach(([key, value]) => {
          if (value.breaks[0]) {
            breakCount += 1;
          }
        });

        expect(breakCount).toBe(18);
      });

      test('should daily schedules with one Daily Schedule replacement as there is one dailySchedule model in range', async () => {
        const dailySchedule = JSON.parse(JSON.stringify(dailySchedules[0]));
        dailySchedule.date = '2018-04-03';
        await DailySchedule.create(dailySchedule);

        const timeOff = {
          startDate: '2018-04-04T23:00:00.000Z',
          endDate: '2018-04-22T00:00:00.000Z',
          practitionerId: practitioner.id,
          allDay: true,
        };

        await PractitionerRecurringTimeOff.create(timeOff);

        const body = await practitionerDailySchedule(practitioner.id, '2018-04-02T21:38:33.880Z', '2018-04-21T21:38:33.880Z', 'America/Vancouver');

        expect(body['2018-04-03'].startTime).toBe('2018-04-04T01:00:00.000Z');
        expect(body['2018-04-03'].endTime).toBe('2018-04-04T04:00:00.000Z');
      });

    });
  });
});
