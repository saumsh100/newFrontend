
import moment from 'moment';
import {
  Appointment,
  DailySchedule,
  Practitioner,
  Practitioner_Service,
  PractitionerRecurringTimeOff,
  Request,
} from 'CareCruModels';
import { seedTestAvailabilities } from '../../../util/seedTestAvailabilities';
import fetchDynamicDataForAvailabilities, {
  fetchAppointments,
  fetchRequests,
} from '../../../../server/lib/availabilities/fetchDynamicDataForAvailabilities';
import { wipeAllModels } from '../../../util/wipeModel';

// TODO: make seeds more modular so we can see here
const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const serviceId = '5f439ff8-c55d-4423-9316-a41240c4d329';
const chairId = '2f439ff8-c55d-4423-9316-a41240c4d329';
const patientUserId = '6beab035-b72c-4f7a-ad73-09465cbf5654';
const practitionerId = '4f439ff8-c55d-4423-9316-a41240c4d329';

const makeApptData = data => Object.assign({}, {
  accountId,
  serviceId,
  chairId,
  practitionerId,
}, data);

const makeDailyScheduleData = data => Object.assign({}, {
  accountId,
  startTime: '1970-01-31T08:00:00.000Z',
  endTime: '1970-01-31T08:00:00.000Z',
}, data);

const makeRequestData = data => Object.assign({}, {
  accountId,
  serviceId,
  patientUserId,
  requestingPatientUserId: patientUserId,
}, data);

const makePractData = data => Object.assign({}, {
  accountId,
  isActive: true,
  isHidden: false,
}, data);

const range = (d, h) => ({
  startDate: d.hours(h).minutes(0).seconds(0).milliseconds(0).toISOString(),
  endDate: d.hours(h + 1).minutes(0).seconds(0).milliseconds(0).toISOString(),
});

async function seedAppointmentPattern(practitioner, startDate, endDate) {
  const numDays = moment(endDate).diff(startDate, 'days');

  let i;
  let appointments = [];
  let date = startDate.clone();
  for (i = 0; i < numDays; i++) {
    date = date.add(1, 'day');
    appointments = [
      ...appointments,
      makeApptData({ ...range(date, 8), practitionerId: practitioner.id }),
      makeApptData({ ...range(date, 9), practitionerId: practitioner.id }),
      makeApptData({ ...range(date, 10), practitionerId: practitioner.id }),
      makeApptData({ ...range(date, 11), practitionerId: practitioner.id }),
      makeApptData({ ...range(date, 12), practitionerId: practitioner.id }),
      makeApptData({ ...range(date, 13), practitionerId: practitioner.id }),
      makeApptData({ ...range(date, 14), practitionerId: practitioner.id }),
      makeApptData({ ...range(date, 14), practitionerId: practitioner.id }),
    ];
  }

  return await Appointment.bulkCreate(appointments);
}

async function seedPractitionerService(practitionerId, serviceId) {
  return await Practitioner_Service.create({
    practitionerId,
    serviceId,
  });
}

describe('Availabilities Library', () => {
  beforeAll(async () => {
    await seedTestAvailabilities();
  });

  afterAll(async () => {
    await wipeAllModels();
  });

  describe('Availabilities Helpers', () => {
    describe('#fetchAppointments', () => {
      let practitioners;
      beforeAll(async () => {
        practitioners = await Practitioner.bulkCreate([
          makePractData({ firstName: 'Jack' }),
          makePractData({ firstName: 'Jeff' }),
          makePractData({ firstName: 'Jim' }),
          makePractData({ firstName: 'Joe' }),
          makePractData({ firstName: 'Justin' }),
        ]);

        const startDate = moment('2018-03-03 01:00:00');
        const endDate = moment('2018-03-06 01:00:00');

        for (const practitioner of practitioners) {
          await seedPractitionerService(practitioner.id, serviceId);
          await seedAppointmentPattern(practitioner, startDate, endDate);
        }
      });

      test('Should fetch appointments for the practitioners in order', async () => {
        const appts = await fetchAppointments({
          startDate: moment('2018-03-03 01:00:00').toISOString(),
          endDate: moment('2018-03-05 01:00:00').toISOString(),
        });

        // 5 practitioners x 8 appts per day = 40
        expect(appts.length).toBe(40);
      });
    });

    describe('#fetchRequests', () => {
      let requests;
      beforeAll(async () => {
        requests = await Request.bulkCreate([
          makeRequestData({ ...range(moment('2018-03-05'), 8) }),
          makeRequestData({ ...range(moment('2018-03-06'), 8) }),
          makeRequestData({ ...range(moment('2018-03-07'), 8) }),
        ]);
      });

      test('Should fetch 1 request', async () => {
        const requests = await fetchRequests({
          accountId,
          startDate: moment('2018-03-05 01:00:00').toISOString(),
          endDate: moment('2018-03-05 23:00:00').toISOString(),
        });

        // 5 practitioners x 8 appts per day = 40
        expect(requests.length).toBe(1);
      });

      test('Should fetch 3 requests', async () => {
        const requests = await fetchRequests({
          accountId,
          startDate: moment('2018-03-05 01:00:00').toISOString(),
          endDate: moment('2018-03-09 23:00:00').toISOString(),
        });

        // 5 practitioners x 8 appts per day = 40
        expect(requests.length).toBe(3);
      });
    });

    describe('#fetchDynamicDataForAvailabilities', () => {
      let practitioners;
      let dailySchedules;
      let requests;
      beforeAll(async () => {
        requests = await Request.bulkCreate([
          makeRequestData({ ...range(moment('2018-03-05'), 8) }),
          makeRequestData({ ...range(moment('2018-03-06'), 8) }),
          makeRequestData({ ...range(moment('2018-03-07'), 8) }),
        ]);

        practitioners = await Practitioner.bulkCreate([
          makePractData({ firstName: 'Jack' }),
          makePractData({ firstName: 'Jeff' }),
        ]);

        dailySchedules = await DailySchedule.bulkCreate([
          makeDailyScheduleData({ date: '2018-03-05', practitionerId: null }),
          makeDailyScheduleData({ date: '2018-03-05', practitionerId: practitioners[0].id }),
        ]);

        const startDate = moment('2018-03-03 01:00:00');
        const endDate = moment('2018-03-06 01:00:00');

        for (const practitioner of practitioners) {
          await seedPractitionerService(practitioner.id, serviceId);
          await seedAppointmentPattern(practitioner, startDate, endDate);
        }
      });

      test('Should fetch the correct dailySchedules and appts', async () => {
        const result = await fetchDynamicDataForAvailabilities({
          account: { id: accountId },
          practitioners,
          startDate: moment('2018-03-05 01:00:00').toISOString(),
          endDate: moment('2018-03-05 23:00:00').toISOString(),
        });

        expect(result.account.dailySchedules.length).toBe(1);
        const jack = result.practitioners.find(p => p.dataValues.firstName === 'Jack');
        expect(jack.appointments.length).toBe(8);
        expect(jack.dailySchedules.length).toBe(1);

        // Make sure that the chair has all the appointments
        // 7 practitioners (we added 2 above notice its beforeAll) x 8 appts per day = 56
        expect(result.chairs[chairId].appointments.length).toBe(56);
      });
    });
  });
});
