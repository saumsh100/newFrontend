
import {
  Practitioner,
  Appointment,
  PractitionerRecurringTimeOff,
} from '../../../../server/_models';
import {
  seedTestAvailabilities,
  wipeTestAvailabilities,
} from '../../../util/seedTestAvailabilities';
import {
  fetchServiceData,
  fetchPractitionerData,
  fetchAvailabilities,
} from '../../../../server/lib/availabilities';

// TODO: make seeds more modular so we can see here
const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const serviceId = '5f439ff8-c55d-4423-9316-a41240c4d329';
const fillServiceId = 'e18bd613-c76b-4a9a-a1df-850c867b2cab';
const funServiceId = 'ac286d7e-cb62-4ea1-8425-fc7e22195692';
const practitionerId = '4f439ff8-c55d-4423-9316-a41240c4d329';
const practitionerId4 = '4f439ff8-c55d-4423-9316-a41240c4d329';
const weeklyScheduleId = '39b9ed42-b82b-4fb5-be5e-9dfded032bdf';
const cleanupServiceId = '5f439ff8-c55d-4423-9316-a41240c4d329';
const crazyServiceId = '49ddcf57-9202-41b9-bc65-bb3359bebd83';
const timeOffId = 'beefb035-b72c-4f7a-ad73-09465cbf5654';

describe.skip('Availabilities Library', () => {
  beforeAll(async () => {
    await seedTestAvailabilities();
  });

  afterAll(async () => {
    await wipeTestAvailabilities();
  });

  describe('#Availabilities Sequelize', () => {
    test('should return Practitioner with 8 Appointments', () => {
      const startDate = (new Date(2017, 3, 3, 8, 0)).toISOString();
      const endDate = (new Date(2017, 3, 3, 12, 0)).toISOString();

      const options = {
        accountId,
        serviceId,
        startDate,
        endDate,
      };

      Practitioner.findOne({
        where: { id: practitionerId },
        include: [{ model: Appointment, as: 'appointments', raw: true }],
      }).then(users => {
        expect(users.get({ plain: true }).appointments.length).toBe(8);
      });
    });

    describe('#fetchServiceData - Sequelize', () => {
      test('should be a function', () => {
        expect(typeof fetchServiceData).toBe('function');
      });

      test('should respond with an error for no service with that serviceId', () => {
        const startDate = (new Date(3000, 1, 1)).toISOString();
        const endDate = (new Date(3001, 1, 1)).toISOString();
        return fetchServiceData({ accountId, serviceId: 'cat', startDate, endDate })
          .catch((err) => {
            expect(typeof err.message).toBe('string');
            // expect(err.status).to.equal(400);
          });
      });

      test('should respond with an error for no practitioners', () => {
        const startDate = (new Date(3000, 1, 1)).toISOString();
        const endDate = (new Date(3001, 1, 1)).toISOString();
        return fetchServiceData({ accountId, serviceId, practitionerId: 'cat', startDate, endDate })
          .catch((err) => {
            expect(err.message).toBe('Service has no practitioners with id: cat');
            // expect(err.status).to.equal(400);
          });
      });

      test('should respond with the appropriate practitioner', () => {
        const startDate = (new Date(3000, 1, 1)).toISOString();
        const endDate = (new Date(3001, 1, 1)).toISOString();
        return fetchServiceData({ accountId, serviceId, practitionerId, startDate, endDate })
          .then((service) => {
            expect(service.practitioners.length).toBe(1);
            expect(service.practitioners[0].id).toBe(practitionerId);
          });
      });

      test('should respond with the correct requests', () => {
        const startDate = (new Date(3000, 1, 1)).toISOString();
        const endDate = (new Date(3001, 1, 1)).toISOString();
        return fetchServiceData({ accountId, serviceId, practitionerId, startDate, endDate })
          .then((service) => {
            expect(Array.isArray(service.requests)).toBe(true);
            expect(service.requests.length).toBe(0);
          });
      });
    });

    describe('#fetchPractitionerData - Sequelize', () => {
      test('should be a function', () => {
        expect(typeof fetchPractitionerData).toBe('function');
      });

      describe('1 Practitioner', () => {
        let practitioners;
        beforeEach(() => {
          return Practitioner.findOne({ where: { id: practitionerId }, raw: true })
            .then((p) => {
              practitioners = [p];
            });
        });

        test('should return the 1 weeklySchedule for 1 practitioner', () => {
          const startDate = (new Date(3000, 1, 1)).toISOString();
          const endDate = (new Date(3001, 1, 1)).toISOString();
          return fetchPractitionerData({ practitioners, startDate, endDate })
            .then((data) => {
              const weeklySchedules = data.weeklySchedules;
              expect(Array.isArray(weeklySchedules)).toBe(true);
              expect(weeklySchedules.length).toBe(1);
              expect(weeklySchedules[0].id).toBe(weeklyScheduleId);
            });
        });

        test('should return 0 appointments and 0 timeOffs', () => {
          const startDate = (new Date(3000, 1, 1)).toISOString();
          const endDate = (new Date(3001, 1, 1)).toISOString();
          return fetchPractitionerData({ practitioners, startDate, endDate })
            .then((data) => {
              expect(Array.isArray(data.practitioners)).toBe(true);
              expect(data.practitioners.length).toBe(1);

              const { appointments, timeOffs } = data.practitioners[0];
              expect(Array.isArray(appointments)).toBe(true);
              expect(appointments.length).toBe(0);
              // expect(Array.isArray(timeOffs)).toBe(true);
              // expect(timeOffs.length).toBe(0);
            });
        });

        test('should return 2 appointments and 7 timeOffs', () => {
          const startDate =(new Date(2017, 3, 3, 8, 0)).toISOString();
          const endDate = (new Date(2017, 3, 3, 10, 0)).toISOString();
          return fetchPractitionerData({ practitioners, startDate, endDate })
            .then(({ practitioners: newPractitioners }) => {
              expect(Array.isArray(newPractitioners)).toBe(true);
              expect(newPractitioners.length).toBe(1);

              const { appointments, timeOffs } = newPractitioners[0];

              expect(Array.isArray(appointments)).toBe(true);
              expect(appointments.length).toBe(2);
              expect(Array.isArray(timeOffs)).toBe(true);
              expect(timeOffs.length).toBe(7);
            });
        });
      });
    });

    describe('#fetchAvailabilities - Sequelize', () => {
      test('should be a function', () => {
        expect(typeof fetchAvailabilities).toBe('function');
      });

      describe('1 Practitioner - 1 day', () => {
        test('should return 0 availabilities', () => {
          const startDate = (new Date()).toISOString();
          const endDate = (new Date()).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(0);
              // const endTime = Date.now();
              //console.log('Time elapsed:', endTime - startTime);
            });
        });

        test('should return 1 availability (seedData just appointments)', () => {
          const startDate = (new Date(2017, 3, 3, 8, 0)).toISOString();
          const endDate = (new Date(2017, 3, 3, 12, 0)).toISOString();

          const startTime = Date.now();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(1);
              expect(availabilities[0]).toEqual({
                startDate: (new Date(2017, 3, 3, 11, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 12, 0)).toISOString(),
                practitionerId,
                chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
              });

              //const endTime = Date.now();
              //console.log('Time elapsed:', endTime - startTime);
            });
        });

        test('should return 5 availabilities 30 timeInterval (seedData just appointments)', () => {
          const startDate = (new Date(2017, 3, 3, 13, 0)).toISOString();
          const endDate = (new Date(2017, 3, 3, 17, 0)).toISOString();

          const startTime = Date.now();

          const options = {
            accountId,
            practitionerId,
            serviceId: fillServiceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(5);
              expect(availabilities[0]).toEqual({
                startDate: (new Date(2017, 3, 3, 13, 30)).toISOString(),
                endDate: (new Date(2017, 3, 3, 13, 51)).toISOString(),
                practitionerId,
                chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
              });
              expect(availabilities[1]).toEqual({
                startDate: (new Date(2017, 3, 3, 14, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 14, 21)).toISOString(),
                practitionerId,
                chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
              });
              expect(availabilities[2]).toEqual({
                startDate: (new Date(2017, 3, 3, 15, 30)).toISOString(),
                endDate: (new Date(2017, 3, 3, 15, 51)).toISOString(),
                practitionerId,
                chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
              });
              expect(availabilities[3]).toEqual({
                startDate: (new Date(2017, 3, 3, 16, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 16, 21)).toISOString(),
                practitionerId,
                chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
              });
              expect(availabilities[4]).toEqual({
                startDate: (new Date(2017, 3, 3, 16, 30)).toISOString(),
                endDate: (new Date(2017, 3, 3, 16, 51)).toISOString(),
                practitionerId,
                chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
              });

              const endTime = Date.now();
              //console.log('Time elapsed:', endTime - startTime);
            });
        });

        test('should return 1 availabilities with 60 timeInterval (seedData just appointments)', () => {
          const startDate = (new Date(2017, 3, 3, 13, 0)).toISOString();
          const endDate = (new Date(2017, 3, 3, 17, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId: fillServiceId,
            timeInterval: 60,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(1);
              expect(availabilities[0]).toEqual({
                startDate: (new Date(2017, 3, 3, 16, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 16, 21)).toISOString(),
                practitionerId,
                chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
              });
            });
        });

        test.skip('should return 4 availabilities with 60 timeInterval. - setting practitionerId and chairId', () => {
          const startDate = (new Date(2017, 3, 3, 13, 0)).toISOString();
          const endDate = (new Date(2017, 3, 3, 17, 0)).toISOString();

          const options = {
            accountId,
            serviceId: cleanupServiceId,
            timeInterval: 60,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(4);
              expect(availabilities[1].practitionerId).not.toEqual(practitionerId4);
              expect(availabilities[3]).toEqual({
                startDate: (new Date(2017, 3, 3, 16, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 17, 0)).toISOString(),
                practitionerId: practitionerId4,
                chairId: '2f439ff8-c55d-4423-9316-a41240c4d329',
              });
            });
        });

        test.skip('should return 1 availabilities with service of 40 mins (seedData just appointments)', () => {
          const startDate = (new Date(2017, 3, 10, 13, 0)).toISOString();
          const endDate = (new Date(2017, 3, 10, 17, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId: funServiceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(Array.isArray(availabilities)).toBe(true);
              // expect(availabilities.length).toBe(1);
              console.log('availabilities[0]', availabilities[0]);
              console.log('availabilities[1]', availabilities[1]);

              expect(availabilities[0]).toEqual({
                startDate: (new Date(2017, 3, 10, 16, 0)).toISOString(),
                endDate: (new Date(2017, 3, 10, 16, 40)).toISOString(),
              });
            });
        });

        test.skip('should return 1 availabilities with service of 70 mins (seedData just appointments)', () => {
          const startDate = (new Date(2017, 3, 17, 13, 0)).toISOString();
          const endDate = (new Date(2017, 3, 17, 17, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId: crazyServiceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(1);
              expect(availabilities[0]).toEqual({
                startDate: (new Date(2017, 3, 17, 14, 30)).toISOString(),
                endDate: (new Date(2017, 3, 17, 15, 40)).toISOString(),
              });
            });
        });

        test.skip('should return 2 availabilities (seedData w/ requests)', () => {
          const startDate = (new Date(2017, 3, 3, 8, 0)).toISOString();
          const endDate = (new Date(2017, 3, 3, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities[0]).toEqual({
                startDate: (new Date(2017, 3, 3, 11, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 12, 0)).toISOString(),
              });

              expect(availabilities[1]).toEqual({
                startDate: (new Date(2017, 3, 3, 16, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 17, 0)).toISOString(),
              });

              expect(availabilities.length).toBe(2);
            });
        });

        test.skip('should return a full monday 8 availabilities (seedData w/ repeat schedule)', () => {
          const startDate = (new Date(2017, 4, 8, 8, 0)).toISOString();
          const endDate = (new Date(2017, 4, 8, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(availabilities.length).toBe(8);
            });
        });

        test('should return an empty monday 8 they are closed (seedData w/ repeat schedule)', () => {
          const startDate = (new Date(2017, 4, 15, 8, 0)).toISOString();
          const endDate = (new Date(2017, 4, 15, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(availabilities[0]).toBeUndefined();

            });
        });

        test.skip('should return a full sunday 8 availabilities (seedData w/ repeat schedule)', () => {
          const startDate = (new Date(2017, 4, 14, 8, 0)).toISOString();
          const endDate = (new Date(2017, 4, 14, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(availabilities.length).toBe(8);
            });
        });

        test('should return an empty sunday 8 as they are closed (seedData w/ repeat schedule)', () => {
          const startDate = (new Date(2017, 4, 7, 8, 0)).toISOString();
          const endDate = (new Date(2017, 4, 7, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(availabilities[0]).toBeUndefined();
            });
        });

        test('should return nothing as they are practitioner has day off (seedData w/ no repeat schedule)', () => {
          const startDate = (new Date(2017, 1, 27, 8, 0)).toISOString();
          const endDate = (new Date(2017, 1, 27, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(availabilities[0]).toBeUndefined();
            });
        });

        test.skip('should return 9 as this is the day after the practitioner has day off (seedData w/ no repeat schedule)', () => {
          const startDate = (new Date(2017, 1, 28, 8, 0)).toISOString();
          const endDate = (new Date(2017, 1, 28, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(availabilities.length).toBe(9);
            });
        });


        test.skip('should return 5 as this is the day the practitioner is working for the middle of day (seedData w/ no repeat schedule)', () => {
          const startDate = (new Date(2017, 2, 7, 8, 0)).toISOString();
          const endDate = (new Date(2017, 2, 7, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              expect(availabilities[0]).toEqual({
                startDate: (new Date(2017, 2, 7, 12, 0)).toISOString(),
                endDate: (new Date(2017, 2, 7, 13, 0)).toISOString(),
              });

              expect(availabilities[1]).toEqual({
                startDate: (new Date(2017, 2, 7, 13, 0)).toISOString(),
                endDate: (new Date(2017, 2, 7, 14, 0)).toISOString(),
              });

              expect(availabilities[2]).toEqual({
                startDate: (new Date(2017, 2, 7, 14, 0)).toISOString(),
                endDate: (new Date(2017, 2, 7, 15, 0)).toISOString(),
              });

              expect(availabilities[3]).toEqual({
                startDate: (new Date(2017, 2, 7, 15, 0)).toISOString(),
                endDate: (new Date(2017, 2, 7, 16, 0)).toISOString(),
              });

              expect(availabilities.length).toBe(4);
            });
        });
      });

      describe('No Preference on Practitioner - 1 day morning', () => {
        test.skip('should return 4 availabilities (1 from prac. above and 4 from other but without duplicates)', () => {
          const startDate = (new Date(2017, 3, 3, 8, 0)).toISOString();
          const endDate = (new Date(2017, 3, 3, 12, 0)).toISOString();

          const options = {
            accountId,
            serviceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              //console.log('availabilities', availabilities);
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(4);
              expect(availabilities[0]).toEqual({
                startDate: (new Date(2017, 3, 3, 8, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 9, 0)).toISOString(),
              });

              expect(availabilities[1]).toEqual({
                startDate: (new Date(2017, 3, 3, 9, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 10, 0)).toISOString(),
              });

              expect(availabilities[2]).toEqual({
                startDate: (new Date(2017, 3, 3, 10, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 11, 0)).toISOString(),
              });

              expect(availabilities[3]).toEqual({
                startDate: (new Date(2017, 3, 3, 11, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 12, 0)).toISOString(),
              });

              // const endTime = Date.now();
              //console.log('Time elapsed:', endTime - startTime);
            });
        });
      });

      describe('No Preference on Practitioner - Monday to Friday (wide open)', () => {
        test.skip('should return 36 availabilities for M,T,T,F (W closed) 1 prac has break but the other is avaialble so does not matter', () => {
          const startDate = (new Date(2017, 4, 1, 7, 23)).toISOString();
          const endDate = (new Date(2017, 4, 6, 7, 23)).toISOString();

          // const startTime = Date.now();

          const options = {
            accountId,
            serviceId,
            startDate,
            endDate,
          };

          return fetchAvailabilities(options)
            .then((availabilities) => {
              // debugger;
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(36);
              //const endTime = Date.now();
              //console.log('Time elapsed:', endTime - startTime);
            });
        });
      });

      describe('Creating a Recurring TimeOff', () => {
        test('should return a recurring time off on Sunday', () => {
          return PractitionerRecurringTimeOff.findById(timeOffId)
            .then((timeOff) => {
              const recurringTimeOff = timeOff.get({ plain: true });
              expect(recurringTimeOff.dayOfWeek).toBe('Sunday');
            });
        });
      });
    });
  });
});
