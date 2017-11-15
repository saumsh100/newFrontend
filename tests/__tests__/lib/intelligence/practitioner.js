
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import {
  recurringTimeOffsFilter,
  practitionersTimeOffHours,
  practitionersTotalHours,
} from '../../../../server/lib/intelligence/practitioner';


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
  startDate: null,
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
}]

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
  });
});
