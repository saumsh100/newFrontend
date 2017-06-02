
/**
 * MAJOR DISCLAIMER: this assumes the DB is seeded with seeds!
 */

const { Practitioner } = require('../../../server/models');

// TODO: make seeds more modular so we can see here
const practitionerId = '4f439ff8-c55d-4423-9316-a41240c4d329';
const weeklyScheduleId = '79b9ed42-b82b-4fb5-be5e-9dfded032bdf';

describe('Practitioner', () => {
  describe('#get', () => {
    it('should be a function', (done) => {
      expect(typeof Practitioner.get).toBe('function');
      done();
    });

    it('should return a practitioner object', (done) => {
      Practitioner.get(practitionerId)
        .then((practitioner) => {
          expect(typeof practitioner).toBe('object');
          expect(practitioner.id).toBe(practitionerId);
          done();
        });
    });
  });

  describe('#getWeeklySchedule', () => {
    let practitioner;
    beforeEach((done) => {
      Practitioner.get(practitionerId)
        .then((p) => {
          practitioner = p;
          done();
        });
    });

    it('should be a function', (done) => {
      expect(typeof practitioner.getWeeklySchedule).toBe('function');
      done();
    });

    it('should return the proper weeklySchedule', (done) => {
      practitioner.getWeeklySchedule()
        .then((ws) => {
          expect(ws.id).toBe(weeklyScheduleId);
          done();
        });
    });
  });

  /*describe('#getTimeOff', () => {
    let practitioner;
    beforeEach((done) => {
      Practitioner.get(practitionerId)
        .then((p) => {
          practitioner = p;
          done();
        });
    });

    it('should be a function', (done) => {
      expect(typeof practitioner.getTimeOff).toBe('function');
      done();
    });

    it('should get 0 timesOff for practitioner ', (done) => {
      const startDate = new Date(2018, 1, 19, 8, 0);
      const endDate = new Date(2018, 1, 25, 0, 0);
      practitioner.getTimeOff(startDate, endDate)
        .then((timeOff) => {
          //expect(Array.isArray(timeOff)).toBe(true);
          expect(timeOff.length).toBe(0);
          done();
        });
    });

    it('should get 3 timesOff for practitioner ', (done) => {
      const startDate = new Date(2017, 2, 19, 8, 0);
      const endDate = new Date(2017, 2, 25, 0, 0);
      practitioner.getTimeOff(startDate, endDate)
        .then((timeOff) => {
          //expect(Array.isArray(timeOff)).toBe(true);
          expect(timeOff.length).toBe(3);
          done();
        });
    });

    it('should get 4 timesOff for practitioner ', (done) => {
      const startDate = new Date(2017, 2, 18);
      const endDate = new Date(2017, 2, 30);
      practitioner.getTimeOff(startDate, endDate)
        .then((timeOff) => {
          //expect(Array.isArray(timeOff)).toBe(true);
          expect(timeOff.length).toBe(4);
          done();
        });
    });
  });*/
});


