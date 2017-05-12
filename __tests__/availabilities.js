
/**
 * MAJOR DISCLAIMER: this assumes the DB is seeded with seeds!
 */

const {
  fetchServiceData,
  fetchPractitionerData,
  fetchAvailabilities,
} = require('../server/lib/availabilities');
const Practitioner = require('../server/models/Practitioner');

// TODO: make seeds more modular so we can see here
const accountId = '1aeab035-b72c-4f7a-ad73-09465cbf5654';
const serviceId = '5f439ff8-c55d-4423-9316-a41240c4d329';
const practitionerId = '4f439ff8-c55d-4423-9316-a41240c4d329';
const weeklyScheduleId = '79b9ed42-b82b-4fb5-be5e-9dfded032bdf';

describe('Availabilities Library', () => {
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

      it('should return 2 appointments and 0 timeOffs', (done) => {
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
            expect(timeOffs.length).toBe(0);
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

      it('should return 3 availabilities (seedData w/ requests)', (done) => {
        const startDate = (new Date(2017, 3, 3, 8, 0)).toISOString();
        const endDate = (new Date(2017, 3, 3, 22, 0)).toISOString();

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
            expect(availabilities.length).toBe(3);
            expect(availabilities[0]).toEqual({
              startDate: (new Date(2017, 3, 3, 11, 0)).toISOString(),
              endDate: (new Date(2017, 3, 3, 12, 0)).toISOString(),
            });

            expect(availabilities[1]).toEqual({
              startDate: (new Date(2017, 3, 3, 15, 0)).toISOString(),
              endDate: (new Date(2017, 3, 3, 16, 0)).toISOString(),
            });

            expect(availabilities[2]).toEqual({
              startDate: (new Date(2017, 3, 3, 16, 0)).toISOString(),
              endDate: (new Date(2017, 3, 3, 17, 0)).toISOString(),
            });

            const endTime = Date.now();
            //console.log('Time elapsed:', endTime - startTime);
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
});

