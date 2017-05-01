
/**
 * MAJOR DISCLAIMER: this assumes the DB is seeded with seeds!
 */

require('../../server/models/relations');
const { expect } = require('chai');
const Practitioner = require('../../server/models/Practitioner');

// TODO: make seeds more modular so we can see here
const practitionerId = '4f439ff8-c55d-4423-9316-a41240c4d329';
const weeklyScheduleId = '79b9ed42-b82b-4fb5-be5e-9dfded032bdf';

describe('Practitioner', () => {
  describe('#get', () => {
    it('should be a function', (done) => {
      expect(Practitioner.get).to.be.a('function');
      done();
    });

    it('should return a practitioner object', (done) => {
      Practitioner.get(practitionerId)
        .then((practitioner) => {
          expect(practitioner).to.be.an('object');
          expect(practitioner.id).to.equal(practitionerId);
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
      expect(practitioner.getWeeklySchedule).to.be.a('function');
      done();
    });

    it('should return the proper weeklySchedule', (done) => {
      practitioner.getWeeklySchedule()
        .then((ws) => {
          expect(ws.id).to.equal(weeklyScheduleId);
          done();
        });
    });
  });

  describe('#getTimeOff', () => {
    let practitioner;
    beforeEach((done) => {
      Practitioner.get(practitionerId)
        .then((p) => {
          practitioner = p;
          done();
        });
    });

    it('should be a function', (done) => {
      expect(practitioner.getTimeOff).to.be.a('function');
      done();
    });

    it('should get 0 timesOff for practitioner ', (done) => {
      const startDate = new Date(2018, 1, 19, 8, 0);
      const endDate = new Date(2018, 1, 25, 0, 0);
      practitioner.getTimeOff(startDate, endDate)
        .then((timeOff) => {
          expect(timeOff).to.be.an('array');
          expect(timeOff.length).to.equal(0);
          done();
        });
    });

    it('should get 3 timesOff for practitioner ', (done) => {
      const startDate = new Date(2017, 2, 19, 8, 0);
      const endDate = new Date(2017, 2, 25, 0, 0);
      practitioner.getTimeOff(startDate, endDate)
        .then((timeOff) => {
          expect(timeOff).to.be.an('array');
          expect(timeOff.length).to.equal(3);
          done();
        });
    });

    it('should get 4 timesOff for practitioner ', (done) => {
      const startDate = new Date(2017, 2, 18);
      const endDate = new Date(2017, 2, 30);
      practitioner.getTimeOff(startDate, endDate)
        .then((timeOff) => {
          expect(timeOff).to.be.an('array');
          expect(timeOff.length).to.equal(4);
          done();
        });
    });
  });
});


