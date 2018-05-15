
import moment from 'moment';
import {
  Practitioner,
  Practitioner_Service,
  Appointment,
  PractitionerRecurringTimeOff,
} from '../../../../server/_models';
import {
  seedTestAvailabilities,
  wipeTestAvailabilities,
} from '../../../util/seedTestAvailabilities';
import { fetchAvailabilities } from '../../../../server/lib/availabilities';
import wipeModel, { wipeAllModels } from '../../../util/wipeModel';

// TODO: make seeds more modular so we can see here
const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const serviceId = '5f439ff8-c55d-4423-9316-a41240c4d329';
const chairId = '2f439ff8-c55d-4423-9316-a41240c4d329';
const fillServiceId = 'e18bd613-c76b-4a9a-a1df-850c867b2cab';
const funServiceId = 'ac286d7e-cb62-4ea1-8425-fc7e22195692';
const practitionerId = '4f439ff8-c55d-4423-9316-a41240c4d329';
const practitionerId4 = '4f439ff8-c55d-4423-9316-a41240c4d329';
const weeklyScheduleId = '39b9ed42-b82b-4fb5-be5e-9dfded032bdf';
const cleanupServiceId = '5f439ff8-c55d-4423-9316-a41240c4d329';
const crazyServiceId = '49ddcf57-9202-41b9-bc65-bb3359bebd83';
const timeOffId = 'beefb035-b72c-4f7a-ad73-09465cbf5654';

const makeApptData = data => Object.assign({}, {
  accountId,
  serviceId,
  chairId,
  practitionerId,
}, data);

const makePractData = data => Object.assign({}, {
  accountId,
  isActive: true,
  isHidden: false,
}, data);

/*
  - seed lots of practitioners (imagine 6 hygenists)
  - for each practitioner
      - seed a pattern of appointments over 3 months
*/


// Problems we wanna solve:
// - proper API endpoint monitoring
// - how to efficiently invoke more detailed logs?
// - be able to use this test suite in a way that provides insight into how performant
// all of the components of it are

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

  describe('Availablilities Performance Testing', () => {
    describe('Large Clinic', () => {
      let practitioners;
      beforeAll(async () => {
        // Seed Practitioners
        // Seed Average Schedule Data
        // Seed Average Appointments per day over
        practitioners = await Practitioner.bulkCreate([
          makePractData({ firstName: 'Jack' }),
          makePractData({ firstName: 'Jeff' }),
          makePractData({ firstName: 'Jim' }),
          makePractData({ firstName: 'Joe' }),
          makePractData({ firstName: 'Justin' }),
        ]);

        const startDate = moment('2018-03-03 01:00:00');
        const endDate = moment('2018-06-03 01:00:00');

        for (const practitioner of practitioners) {
          await seedPractitionerService(practitioner.id, serviceId);
          await seedAppointmentPattern(practitioner, startDate, endDate);
        }
      });

      test.skip('it should be under 500ms', async () => {
        const count = await Appointment.count({});
        console.log('count', count);
      });

      test.skip('take 500ms', async () => {
        const count = await Appointment.count({});
        console.log('count', count);

        const start = Date.now();

        const availabilities = await fetchAvailabilities({
          accountId,
          serviceId,
          startDate: moment('2018-03-03 01:00:00').toISOString(),
          endDate: moment('2018-06-03 01:00:00').toISOString(),
        });

        console.log(`${Date.now() - start}ms to run`);

        expect(availabilities.length).toBe(3);
      });
    });
  });
});
