import bcrypt from 'bcrypt';
import { passwordHashSaltRounds } from '../../server/config/globals';
import { Practitioner as _Practitioner, Appointment as _Appointment, PractitionerRecurringTimeOff as _PractitionerRecurringTimeOff } from '../../server/_models';
import { Appointment } from '../../server/models';
import {
  seedTestAvailabilities,
  seedTestAvailabilitiesSequelize,
  wipeTestAvailabilities,
} from '../util/seedTestAvailabilities';
import { wipeAllModels } from '../util/wipeModel';
import { omitProperties }  from '../util/selectors';

const {
  fetchServiceData,
  fetchPractitionerData,
  fetchAvailabilities,
} = require('../../server/lib/availabilities');

import {
  fetchServiceData as _fetchServiceData,
  fetchPractitionerData as _fetchPractitionerData,
  fetchAvailabilities as _fetchAvailabilities,
} from '../../server/lib/_availabilities';

const Practitioner = require('../../server/models/Practitioner');

// TODO: make seeds more modular so we can see here
const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const serviceId = '5f439ff8-c55d-4423-9316-a41240c4d329';
const fillServiceId = 'e18bd613-c76b-4a9a-a1df-850c867b2cab';
const funServiceId = 'ac286d7e-cb62-4ea1-8425-fc7e22195692';
const practitionerId = '4f439ff8-c55d-4423-9316-a41240c4d329';
const weeklyScheduleId = '39b9ed42-b82b-4fb5-be5e-9dfded032bdf';
const crazyServiceId = '49ddcf57-9202-41b9-bc65-bb3359bebd83';
const timeOffId = 'beefb035-b72c-4f7a-ad73-09465cbf5654';

describe('Availabilities Library', () => {
  beforeAll(async () => {
    await wipeAllModels();
    await wipeTestAvailabilities();
    await seedTestAvailabilities();
    await seedTestAvailabilitiesSequelize();
  });

  afterAll(async () => {
    await wipeAllModels();
    await wipeTestAvailabilities();
  });

  describe('#fetchServiceData', () => {
    it('should be a function', (done) => {
      expect(typeof fetchServiceData).toBe('function');
      done();
    });

    it('should respond with an error for no service with that serviceId', (done) => {
      const startDate = (new Date(3000, 1, 1)).toISOString();
      const endDate = (new Date(3001, 1, 1)).toISOString();
      fetchServiceData({ accountId, serviceId: 'cat', startDate, endDate })
        .catch((err) => {
          expect(typeof err.message).toBe('string');
          // expect(err.status).to.equal(400);
          done();
        });
    });

    it('should respond with an error for no practitioners', (done) => {
      const startDate = (new Date(3000, 1, 1)).toISOString();
      const endDate = (new Date(3001, 1, 1)).toISOString();
      fetchServiceData({ accountId, serviceId, practitionerId: 'cat', startDate, endDate })
        .catch((err) => {
          expect(err.message).toBe('Service has no practitioners with id: cat');
          // expect(err.status).to.equal(400);
          done();
        });
    });

    it('should respond with the appropriate practitioner', (done) => {
      const startDate = (new Date(3000, 1, 1)).toISOString();
      const endDate = (new Date(3001, 1, 1)).toISOString();
      fetchServiceData({ accountId, serviceId, practitionerId, startDate, endDate })
        .then((service) => {
          expect(service.practitioners.length).toBe(1);
          expect(service.practitioners[0].id).toBe(practitionerId);
          done();
        });
    });

    it('should respond with the correct reservations and requests', (done) => {
      const startDate = (new Date(3000, 1, 1)).toISOString();
      const endDate = (new Date(3001, 1, 1)).toISOString();
      fetchServiceData({ accountId, serviceId, practitionerId, startDate, endDate })
        .then((service) => {
          expect(Array.isArray(service.requests)).toBe(true);
          expect(Array.isArray(service.reservations)).toBe(true);
          expect(service.requests.length).toBe(0);
          expect(service.reservations.length).toBe(0);
          done();
        });
    });
  });

  describe('#fetchPractitionerData', () => {
    it('should be a function', (done) => {
      expect(typeof fetchPractitionerData).toBe('function');
      done();
    });

    describe('1 Practitioner', () => {
      let practitioners;
      beforeEach((done) => {
        Practitioner.get(practitionerId)
          .then((p) => {
            practitioners = [p];
            done();
          });
      });

      it('should return the 1 weeklySchedule for 1 practitioner', (done) => {
        const startDate = (new Date(3000, 1, 1)).toISOString();
        const endDate = (new Date(3001, 1, 1)).toISOString();
        fetchPractitionerData({ practitioners, startDate, endDate })
          .then(({ weeklySchedules }) => {
            expect(Array.isArray(weeklySchedules)).toBe(true);
            expect(weeklySchedules.length).toBe(1);
            expect(weeklySchedules[0].id).toBe(weeklyScheduleId);
            done();
          });
      });

      it('should return 0 appointments and 0 timeOffs', (done) => {
        const startDate = (new Date(3000, 1, 1)).toISOString();
        const endDate = (new Date(3001, 1, 1)).toISOString();
        fetchPractitionerData({ practitioners, startDate, endDate })
          .then((data) => {
            expect(Array.isArray(data.practitioners)).toBe(true);
            expect(data.practitioners.length).toBe(1);

            const { appointments, timeOffs } = data.practitioners[0];
            expect(Array.isArray(appointments)).toBe(true);
            expect(appointments.length).toBe(0);
            expect(Array.isArray(timeOffs)).toBe(true);
            expect(timeOffs.length).toBe(0);
            done();
          });
      });

      it('should return 2 appointments and 7 timeOffs', (done) => {
        const startDate =(new Date(2017, 3, 3, 8, 0)).toISOString();
        const endDate = (new Date(2017, 3, 3, 10, 0)).toISOString();
        fetchPractitionerData({ practitioners, startDate, endDate })
          .then(({ practitioners: newPractitioners }) => {
            expect(Array.isArray(newPractitioners)).toBe(true);
            expect(newPractitioners.length).toBe(1);

            const { appointments, timeOffs } = newPractitioners[0];
            expect(Array.isArray(appointments)).toBe(true);
            expect(appointments.length).toBe(2);
            expect(Array.isArray(timeOffs)).toBe(true);
            expect(timeOffs.length).toBe(7);
            done();
          });
      });
    });
  });

  describe('#fetchAvailabilities', () => {
    it('should be a function', (done) => {
      expect(typeof fetchAvailabilities).toBe('function');
      done();
    });

    describe('1 Practitioner - 1 day', () => {
      it('should return 0 availabilities', (done) => {
        const startDate = (new Date()).toISOString();
        const endDate = (new Date()).toISOString();

        const options = {
          accountId,
          practitionerId,
          serviceId,
          startDate,
          endDate,
        };

        fetchAvailabilities(options)
          .then((availabilities) => {
            expect(Array.isArray(availabilities)).toBe(true);
            expect(availabilities.length).toBe(0);
            // const endTime = Date.now();
            //console.log('Time elapsed:', endTime - startTime);
            done();
          });
      });

      it('should return 1 availability (seedData just appointments)', (done) => {
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

        fetchAvailabilities(options)
          .then((availabilities) => {
            expect(Array.isArray(availabilities)).toBe(true);
            expect(availabilities.length).toBe(1);
            expect(availabilities[0]).toEqual({
              startDate: (new Date(2017, 3, 3, 11, 0)).toISOString(),
              endDate: (new Date(2017, 3, 3, 12, 0)).toISOString(),
            });

            const endTime = Date.now();
            //console.log('Time elapsed:', endTime - startTime);
            done();
          });
      });

      it('should return 5 availabilities 30 timeInterval (seedData just appointments)', (done) => {
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
            });
            expect(availabilities[1]).toEqual({
              startDate: (new Date(2017, 3, 3, 14, 0)).toISOString(),
              endDate: (new Date(2017, 3, 3, 14, 21)).toISOString(),
            });
            expect(availabilities[2]).toEqual({
              startDate: (new Date(2017, 3, 3, 15, 30)).toISOString(),
              endDate: (new Date(2017, 3, 3, 15, 51)).toISOString(),
            });
            expect(availabilities[3]).toEqual({
              startDate: (new Date(2017, 3, 3, 16, 0)).toISOString(),
              endDate: (new Date(2017, 3, 3, 16, 21)).toISOString(),
            });
            expect(availabilities[4]).toEqual({
              startDate: (new Date(2017, 3, 3, 16, 30)).toISOString(),
              endDate: (new Date(2017, 3, 3, 16, 51)).toISOString(),
            });

            const endTime = Date.now();
            done();
            //console.log('Time elapsed:', endTime - startTime);
          });
      });

      it('should return 1 availabilities with 60 timeInterval (seedData just appointments)', (done) => {
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
            });
            done();
          });
      });

      it('should return 1 availabilities with service of 40 mins (seedData just appointments)', (done) => {
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
            expect(availabilities.length).toBe(1);
            expect(availabilities[0]).toEqual({
              startDate: (new Date(2017, 3, 10, 16, 0)).toISOString(),
              endDate: (new Date(2017, 3, 10, 16, 40)).toISOString(),
            });
            done();
          });
      });

      it('should return 1 availabilities with service of 70 mins (seedData just appointments)', (done) => {
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
            done();
          });
      });

      it('should return 2 availabilities (seedData w/ requests)', (done) => {
        const startDate = (new Date(2017, 3, 3, 8, 0)).toISOString();
        const endDate = (new Date(2017, 3, 3, 22, 0)).toISOString();

        const options = {
          accountId,
          practitionerId,
          serviceId,
          startDate,
          endDate,
        };

        fetchAvailabilities(options)
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

            done();
          });
      });

      it('should return a full monday 8 availabilities (seedData w/ repeat schedule)', (done) => {
        const startDate = (new Date(2017, 4, 8, 8, 0)).toISOString();
        const endDate = (new Date(2017, 4, 8, 22, 0)).toISOString();

        const options = {
          accountId,
          practitionerId,
          serviceId,
          startDate,
          endDate,
        };

        fetchAvailabilities(options)
          .then((availabilities) => {
            expect(availabilities.length).toBe(8);

            done();
          });
      });

      it('should return an empty monday 8 they are closed (seedData w/ repeat schedule)', (done) => {
        const startDate = (new Date(2017, 4, 15, 8, 0)).toISOString();
        const endDate = (new Date(2017, 4, 15, 22, 0)).toISOString();

        const options = {
          accountId,
          practitionerId,
          serviceId,
          startDate,
          endDate,
        };

        fetchAvailabilities(options)
          .then((availabilities) => {
            expect(availabilities[0]).toBeUndefined();

            done();
          });
      });

      it('should return a full sunday 8 availabilities (seedData w/ repeat schedule)', (done) => {
        const startDate = (new Date(2017, 4, 14, 8, 0)).toISOString();
        const endDate = (new Date(2017, 4, 14, 22, 0)).toISOString();

        const options = {
          accountId,
          practitionerId,
          serviceId,
          startDate,
          endDate,
        };

        fetchAvailabilities(options)
          .then((availabilities) => {
            expect(availabilities.length).toBe(8);

            done();
          });
      });

      it('should return an empty sunday 8 as they are closed (seedData w/ repeat schedule)', (done) => {
        const startDate = (new Date(2017, 4, 7, 8, 0)).toISOString();
        const endDate = (new Date(2017, 4, 7, 22, 0)).toISOString();

        const options = {
          accountId,
          practitionerId,
          serviceId,
          startDate,
          endDate,
        };

        fetchAvailabilities(options)
          .then((availabilities) => {
            expect(availabilities[0]).toBeUndefined();

            done();
          });
      });

      it('should return nothing as they are practitioner has day off (seedData w/ no repeat schedule)', (done) => {
        const startDate = (new Date(2017, 1, 27, 8, 0)).toISOString();
        const endDate = (new Date(2017, 1, 27, 22, 0)).toISOString();

        const options = {
          accountId,
          practitionerId,
          serviceId,
          startDate,
          endDate,
        };

        fetchAvailabilities(options)
          .then((availabilities) => {
            expect(availabilities[0]).toBeUndefined();

            done();
          });
      });

      it('should return 9 as this is the day after the practitioner has day off (seedData w/ no repeat schedule)', (done) => {
        const startDate = (new Date(2017, 1, 28, 8, 0)).toISOString();
        const endDate = (new Date(2017, 1, 28, 22, 0)).toISOString();

        const options = {
          accountId,
          practitionerId,
          serviceId,
          startDate,
          endDate,
        };

        fetchAvailabilities(options)
          .then((availabilities) => {
            expect(availabilities.length).toBe(9);

            done();
          });
      });


      it('should return 5 as this is the day the practitioner is working for the middle of day (seedData w/ no repeat schedule)', (done) => {
        const startDate = (new Date(2017, 2, 7, 8, 0)).toISOString();
        const endDate = (new Date(2017, 2, 7, 22, 0)).toISOString();

        const options = {
          accountId,
          practitionerId,
          serviceId,
          startDate,
          endDate,
        };

        fetchAvailabilities(options)
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

            done();
          });
      });
    });

    describe('No Preference on Practitioner - 1 day morning', () => {
      it('should return 4 availabilities (1 from prac. above and 4 from other but without duplicates)', (done) => {
        const startDate = (new Date(2017, 3, 3, 8, 0)).toISOString();
        const endDate = (new Date(2017, 3, 3, 12, 0)).toISOString();

        const options = {
          accountId,
          serviceId,
          startDate,
          endDate,
        };

        fetchAvailabilities(options)
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

            const endTime = Date.now();
            //console.log('Time elapsed:', endTime - startTime);
            done();
          });
      });
    });

    describe('No Preference on Practitioner - Monday to Friday (wide open)', () => {
      it('should return 36 availabilities for M,T,T,F (W closed) 1 prac has break but the other is avaialble so does not matter', (done) => {
        const startDate = (new Date(2017, 4, 1, 7, 23)).toISOString();
        const endDate = (new Date(2017, 4, 6, 7, 23)).toISOString();

        // const startTime = Date.now();

        const options = {
          accountId,
          serviceId,
          startDate,
          endDate,
        };
        fetchAvailabilities(options)
          .then((availabilities) => {
            // debugger;
            expect(Array.isArray(availabilities)).toBe(true);
            expect(availabilities.length).toBe(36);
            const endTime = Date.now();
            //console.log('Time elapsed:', endTime - startTime);
            done();
          });
      });
    });
  });

  describe('#Availabilities Sequelize', () => {
    it('should return Practitioner with 8 Appointments', (done) => {
      const startDate = (new Date(2017, 3, 3, 8, 0)).toISOString();
      const endDate = (new Date(2017, 3, 3, 12, 0)).toISOString();

      const options = {
        accountId,
        serviceId,
        startDate,
        endDate,
      };

      _Practitioner.findOne({ where: { id: practitionerId }, include: [{ model: _Appointment, as: 'appointments', raw: true }] })
      .then(users => {
        expect(users.get({ plain: true }).appointments.length).toBe(8);
        done();
      });
    });

    describe('#fetchServiceData - Sequelize', () => {
      it('should be a function', (done) => {
        expect(typeof _fetchServiceData).toBe('function');
        done();
      });

      it('should respond with an error for no service with that serviceId', (done) => {
        const startDate = (new Date(3000, 1, 1)).toISOString();
        const endDate = (new Date(3001, 1, 1)).toISOString();
        _fetchServiceData({ accountId, serviceId: 'cat', startDate, endDate })
          .catch((err) => {
            expect(typeof err.message).toBe('string');
            // expect(err.status).to.equal(400);
            done();
          });
      });

      it('should respond with an error for no practitioners', (done) => {
        const startDate = (new Date(3000, 1, 1)).toISOString();
        const endDate = (new Date(3001, 1, 1)).toISOString();
        _fetchServiceData({ accountId, serviceId, practitionerId: 'cat', startDate, endDate })
          .catch((err) => {
            expect(err.message).toBe('Service has no practitioners with id: cat');
            // expect(err.status).to.equal(400);
            done();
          });
      });

      it('should respond with the appropriate practitioner', (done) => {
        const startDate = (new Date(3000, 1, 1)).toISOString();
        const endDate = (new Date(3001, 1, 1)).toISOString();
        _fetchServiceData({ accountId, serviceId, practitionerId, startDate, endDate })
          .then((service) => {
            expect(service.practitioners.length).toBe(1);
            expect(service.practitioners[0].id).toBe(practitionerId);
            done();
          });
      });

      it('should respond with the correct requests', (done) => {
        const startDate = (new Date(3000, 1, 1)).toISOString();
        const endDate = (new Date(3001, 1, 1)).toISOString();
        _fetchServiceData({ accountId, serviceId, practitionerId, startDate, endDate })
          .then((service) => {
            expect(Array.isArray(service.requests)).toBe(true);
            expect(service.requests.length).toBe(0);
            done();
          });
      });
    });

    describe('#fetchPractitionerData - Sequelize', () => {
      it('should be a function', (done) => {
        expect(typeof _fetchPractitionerData).toBe('function');
        done();
      });

      describe('1 Practitioner', () => {
        let practitioners;
        beforeEach((done) => {
          _Practitioner.findOne({ where: { id: practitionerId }, raw: true })
            .then((p) => {
              practitioners = [p];
              done();
            });
        });

        it('should return the 1 weeklySchedule for 1 practitioner', (done) => {
          const startDate = (new Date(3000, 1, 1)).toISOString();
          const endDate = (new Date(3001, 1, 1)).toISOString();
          _fetchPractitionerData({ practitioners, startDate, endDate })
            .then((data) => {
              const weeklySchedules = data.weeklySchedules;
              expect(Array.isArray(weeklySchedules)).toBe(true);
              expect(weeklySchedules.length).toBe(1);
              expect(weeklySchedules[0].id).toBe(weeklyScheduleId);
              done();
            });
        });

        it('should return 0 appointments and 0 timeOffs', (done) => {
          const startDate = (new Date(3000, 1, 1)).toISOString();
          const endDate = (new Date(3001, 1, 1)).toISOString();
          _fetchPractitionerData({ practitioners, startDate, endDate })
            .then((data) => {
              expect(Array.isArray(data.practitioners)).toBe(true);
              expect(data.practitioners.length).toBe(1);

              const { appointments, timeOffs } = data.practitioners[0];
              expect(Array.isArray(appointments)).toBe(true);
              expect(appointments.length).toBe(0);
              // expect(Array.isArray(timeOffs)).toBe(true);
              // expect(timeOffs.length).toBe(0);
              done();
            });
        });

        it('should return 2 appointments and 7 timeOffs', (done) => {
          const startDate =(new Date(2017, 3, 3, 8, 0)).toISOString();
          const endDate = (new Date(2017, 3, 3, 10, 0)).toISOString();
          _fetchPractitionerData({ practitioners, startDate, endDate })
            .then(({ practitioners: newPractitioners }) => {
              expect(Array.isArray(newPractitioners)).toBe(true);
              expect(newPractitioners.length).toBe(1);

              const { appointments, timeOffs } = newPractitioners[0];

              expect(Array.isArray(appointments)).toBe(true);
              expect(appointments.length).toBe(2);
              expect(Array.isArray(timeOffs)).toBe(true);
              expect(timeOffs.length).toBe(7);
              done();
            });
        });
      });
    });

    describe('#fetchAvailabilities - Sequelize', () => {
      it('should be a function', (done) => {
        expect(typeof fetchAvailabilities).toBe('function');
        done();
      });

      describe('1 Practitioner - 1 day', () => {
        it('should return 0 availabilities', (done) => {
          const startDate = (new Date()).toISOString();
          const endDate = (new Date()).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          _fetchAvailabilities(options)
            .then((availabilities) => {
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(0);
              // const endTime = Date.now();
              //console.log('Time elapsed:', endTime - startTime);
              done();
            });
        });

        it('should return 1 availability (seedData just appointments)', (done) => {
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

          _fetchAvailabilities(options)
            .then((availabilities) => {
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(1);
              expect(availabilities[0]).toEqual({
                startDate: (new Date(2017, 3, 3, 11, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 12, 0)).toISOString(),
              });

              const endTime = Date.now();
              //console.log('Time elapsed:', endTime - startTime);
              done();
            });
        });

        it('should return 5 availabilities 30 timeInterval (seedData just appointments)', (done) => {
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

          return _fetchAvailabilities(options)
            .then((availabilities) => {
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(5);
              expect(availabilities[0]).toEqual({
                startDate: (new Date(2017, 3, 3, 13, 30)).toISOString(),
                endDate: (new Date(2017, 3, 3, 13, 51)).toISOString(),
              });
              expect(availabilities[1]).toEqual({
                startDate: (new Date(2017, 3, 3, 14, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 14, 21)).toISOString(),
              });
              expect(availabilities[2]).toEqual({
                startDate: (new Date(2017, 3, 3, 15, 30)).toISOString(),
                endDate: (new Date(2017, 3, 3, 15, 51)).toISOString(),
              });
              expect(availabilities[3]).toEqual({
                startDate: (new Date(2017, 3, 3, 16, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 16, 21)).toISOString(),
              });
              expect(availabilities[4]).toEqual({
                startDate: (new Date(2017, 3, 3, 16, 30)).toISOString(),
                endDate: (new Date(2017, 3, 3, 16, 51)).toISOString(),
              });

              const endTime = Date.now();
              done();
              //console.log('Time elapsed:', endTime - startTime);
            });
        });

        it('should return 1 availabilities with 60 timeInterval (seedData just appointments)', (done) => {
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

          return _fetchAvailabilities(options)
            .then((availabilities) => {
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(1);
              expect(availabilities[0]).toEqual({
                startDate: (new Date(2017, 3, 3, 16, 0)).toISOString(),
                endDate: (new Date(2017, 3, 3, 16, 21)).toISOString(),
              });
              done();
            });
        });

        it('should return 1 availabilities with service of 40 mins (seedData just appointments)', (done) => {
          const startDate = (new Date(2017, 3, 10, 13, 0)).toISOString();
          const endDate = (new Date(2017, 3, 10, 17, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId: funServiceId,
            startDate,
            endDate,
          };

          return _fetchAvailabilities(options)
            .then((availabilities) => {
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(1);
              expect(availabilities[0]).toEqual({
                startDate: (new Date(2017, 3, 10, 16, 0)).toISOString(),
                endDate: (new Date(2017, 3, 10, 16, 40)).toISOString(),
              });
              done();
            });
        });

        it('should return 1 availabilities with service of 70 mins (seedData just appointments)', (done) => {
          const startDate = (new Date(2017, 3, 17, 13, 0)).toISOString();
          const endDate = (new Date(2017, 3, 17, 17, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId: crazyServiceId,
            startDate,
            endDate,
          };

          return _fetchAvailabilities(options)
            .then((availabilities) => {
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(1);
              expect(availabilities[0]).toEqual({
                startDate: (new Date(2017, 3, 17, 14, 30)).toISOString(),
                endDate: (new Date(2017, 3, 17, 15, 40)).toISOString(),
              });
              done();
            });
        });

        it('should return 2 availabilities (seedData w/ requests)', (done) => {
          const startDate = (new Date(2017, 3, 3, 8, 0)).toISOString();
          const endDate = (new Date(2017, 3, 3, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          _fetchAvailabilities(options)
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

              done();
            });
        });

        it('should return a full monday 8 availabilities (seedData w/ repeat schedule)', (done) => {
          const startDate = (new Date(2017, 4, 8, 8, 0)).toISOString();
          const endDate = (new Date(2017, 4, 8, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          _fetchAvailabilities(options)
            .then((availabilities) => {
              expect(availabilities.length).toBe(8);

              done();
            });
        });

        it('should return an empty monday 8 they are closed (seedData w/ repeat schedule)', (done) => {
          const startDate = (new Date(2017, 4, 15, 8, 0)).toISOString();
          const endDate = (new Date(2017, 4, 15, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          _fetchAvailabilities(options)
            .then((availabilities) => {
              expect(availabilities[0]).toBeUndefined();

              done();
            });
        });

        it('should return a full sunday 8 availabilities (seedData w/ repeat schedule)', (done) => {
          const startDate = (new Date(2017, 4, 14, 8, 0)).toISOString();
          const endDate = (new Date(2017, 4, 14, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          _fetchAvailabilities(options)
            .then((availabilities) => {
              expect(availabilities.length).toBe(8);

              done();
            });
        });

        it('should return an empty sunday 8 as they are closed (seedData w/ repeat schedule)', (done) => {
          const startDate = (new Date(2017, 4, 7, 8, 0)).toISOString();
          const endDate = (new Date(2017, 4, 7, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          _fetchAvailabilities(options)
            .then((availabilities) => {
              expect(availabilities[0]).toBeUndefined();

              done();
            });
        });

        it('should return nothing as they are practitioner has day off (seedData w/ no repeat schedule)', (done) => {
          const startDate = (new Date(2017, 1, 27, 8, 0)).toISOString();
          const endDate = (new Date(2017, 1, 27, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          _fetchAvailabilities(options)
            .then((availabilities) => {
              expect(availabilities[0]).toBeUndefined();

              done();
            });
        });

        it('should return 9 as this is the day after the practitioner has day off (seedData w/ no repeat schedule)', (done) => {
          const startDate = (new Date(2017, 1, 28, 8, 0)).toISOString();
          const endDate = (new Date(2017, 1, 28, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          _fetchAvailabilities(options)
            .then((availabilities) => {
              expect(availabilities.length).toBe(9);

              done();
            });
        });


        it('should return 5 as this is the day the practitioner is working for the middle of day (seedData w/ no repeat schedule)', (done) => {
          const startDate = (new Date(2017, 2, 7, 8, 0)).toISOString();
          const endDate = (new Date(2017, 2, 7, 22, 0)).toISOString();

          const options = {
            accountId,
            practitionerId,
            serviceId,
            startDate,
            endDate,
          };

          _fetchAvailabilities(options)
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

              done();
            });
        });
      });

      describe('No Preference on Practitioner - 1 day morning', () => {
        it('should return 4 availabilities (1 from prac. above and 4 from other but without duplicates)', (done) => {
          const startDate = (new Date(2017, 3, 3, 8, 0)).toISOString();
          const endDate = (new Date(2017, 3, 3, 12, 0)).toISOString();

          const options = {
            accountId,
            serviceId,
            startDate,
            endDate,
          };

          _fetchAvailabilities(options)
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

              const endTime = Date.now();
              //console.log('Time elapsed:', endTime - startTime);
              done();
            });
        });
      });

      describe('No Preference on Practitioner - Monday to Friday (wide open)', () => {
        it('should return 36 availabilities for M,T,T,F (W closed) 1 prac has break but the other is avaialble so does not matter', (done) => {
          const startDate = (new Date(2017, 4, 1, 7, 23)).toISOString();
          const endDate = (new Date(2017, 4, 6, 7, 23)).toISOString();

          // const startTime = Date.now();

          const options = {
            accountId,
            serviceId,
            startDate,
            endDate,
          };

          _fetchAvailabilities(options)
            .then((availabilities) => {
              // debugger;
              expect(Array.isArray(availabilities)).toBe(true);
              expect(availabilities.length).toBe(36);
              const endTime = Date.now();
              //console.log('Time elapsed:', endTime - startTime);
              done();
            });
        });
      });

      describe('Creating a Recurring TimeOff', () => {
        it('should return a recurring time off on Sunday', (done) => {
          _PractitionerRecurringTimeOff.findById(timeOffId)
          .then((timeOff) => {
            const recurringTimeOff = timeOff.get({ plain: true });
            expect(recurringTimeOff.dayOfWeek).toBe('Sunday');
            done();
          });
        });
      });
    });
  });
});
