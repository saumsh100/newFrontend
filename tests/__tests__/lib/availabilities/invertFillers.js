
import invertFillers from '../../../../server/lib/availabilities/invertTimeSlots';

const d = (h, m = 0) => new Date(2018, 3, 8, h, m);
const r = (h1, m1, h2, m2) => ({ startDate: d(h1, m1), endDate: d(h2, m2) });

describe('#invertFillers', () => {
  test('it should be a function', () => {
    expect(typeof invertFillers).toBe('function');
  });

  describe('General Scenarios', () => {
    test('it should return 0 timeslots cause startDate === endDate', () => {
      const fillers = [
        r(11, 0, 12, 0),
        r(12, 0, 13, 0),
      ];

      const startDate = d(9, 0);
      const endDate = d(9, 0);

      expect(invertFillers(fillers, startDate, endDate)).toEqual([]);
    });

    test('it should return 2 timeslots both 2 hours long', () => {
      const fillers = [
        r(11, 0, 12, 0),
        r(12, 0, 13, 0),
      ];

      const startDate = d(9, 0);
      const endDate = d(15, 0);

      const result = invertFillers(fillers, startDate, endDate);
      expect(result.length).toEqual(2);
      expect(result[0].startDate.toISOString()).toBe(d(9, 0).toISOString());
      expect(result[0].endDate.toISOString()).toBe(d(11, 0).toISOString());
      expect(result[1].startDate.toISOString()).toBe(d(13, 0).toISOString());
      expect(result[1].endDate.toISOString()).toBe(d(15, 0).toISOString());
    });

    test('it should return 2 timeslots both 1 hour long', () => {
      const fillers = [
        r(8, 0, 9, 0),
        r(10, 0, 11, 0),
        r(12, 0, 13, 0),
      ];

      const startDate = d(8, 30);
      const endDate = d(12, 30);

      const result = invertFillers(fillers, startDate, endDate);
      expect(result.length).toEqual(2);
      expect(result[0].startDate.toISOString()).toBe(d(9, 0).toISOString());
      expect(result[0].endDate.toISOString()).toBe(d(10, 0).toISOString());
      expect(result[1].startDate.toISOString()).toBe(d(11, 0).toISOString());
      expect(result[1].endDate.toISOString()).toBe(d(12, 0).toISOString());
    });

    test('it should return 2 timeslots both 1.5 hours long', () => {
      const fillers = [
        r(7, 0, 8, 0),
        r(10, 0, 11, 0),
        r(13, 0, 14, 0),
      ];

      const startDate = d(8, 30);
      const endDate = d(12, 30);

      const result = invertFillers(fillers, startDate, endDate);
      expect(result.length).toEqual(2);
      expect(result[0].startDate.toISOString()).toBe(d(8, 30).toISOString());
      expect(result[0].endDate.toISOString()).toBe(d(10, 0).toISOString());
      expect(result[1].startDate.toISOString()).toBe(d(11, 0).toISOString());
      expect(result[1].endDate.toISOString()).toBe(d(12, 30).toISOString());
    });

    test('it should return 4 timeslots', () => {
      const fillers = [
        r(7, 0, 8, 0),
        r(10, 0, 11, 0),
        r(13, 0, 14, 0),
      ];

      const startDate = d(6, 30);
      const endDate = d(14, 30);

      const result = invertFillers(fillers, startDate, endDate);

      expect(result.length).toEqual(4);
      expect(result[0].startDate.toISOString()).toBe(d(6, 30).toISOString());
      expect(result[0].endDate.toISOString()).toBe(d(7, 0).toISOString());
      expect(result[1].startDate.toISOString()).toBe(d(8, 0).toISOString());
      expect(result[1].endDate.toISOString()).toBe(d(10, 0).toISOString());
      expect(result[2].startDate.toISOString()).toBe(d(11, 0).toISOString());
      expect(result[2].endDate.toISOString()).toBe(d(13, 0).toISOString());
      expect(result[3].startDate.toISOString()).toBe(d(14, 0).toISOString());
      expect(result[3].endDate.toISOString()).toBe(d(14, 30).toISOString());
    });

    test('it should return 2 timeslots - smaller duration timeslot', () => {
      const fillers = [
        r(8, 0, 9, 0),
        r(8, 30, 8, 45),
      ];

      const startDate = d(7, 0);
      const endDate = d(10, 0);

      const result = invertFillers(fillers, startDate, endDate);
      expect(result.length).toEqual(2);
      expect(result[0].startDate.toISOString()).toBe(d(7, 0).toISOString());
      expect(result[0].endDate.toISOString()).toBe(d(8, 0).toISOString());
      expect(result[1].startDate.toISOString()).toBe(d(9, 0).toISOString());
      expect(result[1].endDate.toISOString()).toBe(d(10, 0).toISOString());
    });

    test('it should return 2 timeslots - smaller duration timeslots', () => {
      const fillers = [
        r(8, 0, 9, 0),
        r(8, 15, 8, 45),
        r(8, 20, 8, 40),
      ];

      const startDate = d(7, 0);
      const endDate = d(10, 0);

      const result = invertFillers(fillers, startDate, endDate);
      expect(result.length).toEqual(2);
      expect(result[0].startDate.toISOString()).toBe(d(7, 0).toISOString());
      expect(result[0].endDate.toISOString()).toBe(d(8, 0).toISOString());
      expect(result[1].startDate.toISOString()).toBe(d(9, 0).toISOString());
      expect(result[1].endDate.toISOString()).toBe(d(10, 0).toISOString());
    });
  });

  describe('All possible combos of last filler + endDate scenarios', () => {
    describe('post is before last filler', () => {
      describe('endDate is before last filler', () => {
        test('should return 1 timeslots', () => {
          const fillers = [
            r(11, 0, 12, 0),
          ];

          const startDate = d(9, 0);
          const endDate = d(10, 0);

          const result = invertFillers(fillers, startDate, endDate);
          expect(result.length).toEqual(1);
          expect(result[0].startDate.toISOString()).toBe(d(9, 0).toISOString());
          expect(result[0].endDate.toISOString()).toBe(d(10, 0).toISOString());
        });
      });

      describe('endDate is during last filler', () => {
        test('should return 1 timeslots', () => {
          const fillers = [
            r(11, 0, 12, 0),
          ];

          const startDate = d(9, 0);
          const endDate = d(11, 30);

          const result = invertFillers(fillers, startDate, endDate);
          expect(result.length).toEqual(1);
          expect(result[0].startDate.toISOString()).toBe(d(9, 0).toISOString());
          expect(result[0].endDate.toISOString()).toBe(d(11, 0).toISOString());
        });
      });

      describe('endDate is after last filler', () => {
        test('should return 2 timeslots', () => {
          const fillers = [
            r(11, 0, 12, 0),
          ];

          const startDate = d(9, 0);
          const endDate = d(13, 0);

          const result = invertFillers(fillers, startDate, endDate);
          expect(result.length).toEqual(2);
          expect(result[0].startDate.toISOString()).toBe(d(9, 0).toISOString());
          expect(result[0].endDate.toISOString()).toBe(d(11, 0).toISOString());
          expect(result[1].startDate.toISOString()).toBe(d(12, 0).toISOString());
          expect(result[1].endDate.toISOString()).toBe(d(13, 0).toISOString());
        });
      });
    });

    describe('post is during last filler', () => {
      describe('endDate is before last filler (would never happen therefore the loops breaks)', () => {
        test('should return 0 timeslots', () => {
          const fillers = [
            r(11, 0, 12, 0),
          ];

          const startDate = d(11, 15);
          const endDate = d(11, 0);

          const result = invertFillers(fillers, startDate, endDate);
          expect(result.length).toEqual(0);
        });
      });

      describe('endDate is during last filler', () => {
        test('should return 0 timeslots', () => {
          const fillers = [
            r(11, 0, 12, 0),
          ];

          const startDate = d(11, 15);
          const endDate = d(11, 45);

          const result = invertFillers(fillers, startDate, endDate);
          expect(result.length).toEqual(0);
        });
      });

      describe('endDate is after last filler', () => {
        test('should return 1 timeslot', () => {
          const fillers = [
            r(11, 0, 12, 0),
          ];

          const startDate = d(11, 15);
          const endDate = d(13, 0);

          const result = invertFillers(fillers, startDate, endDate);
          expect(result.length).toEqual(1);
          expect(result[0].startDate.toISOString()).toBe(d(12, 0).toISOString());
          expect(result[0].endDate.toISOString()).toBe(d(13, 0).toISOString());
        });
      });
    });

    describe('post is after last filler', () => {
      describe('endDate is before last filler (would never happen therefore the loops breaks)', () => {
        test('should return 0 timeslots', () => {
          const fillers = [
            r(11, 0, 12, 0),
          ];

          const startDate = d(13, 0);
          const endDate = d(10, 0);

          const result = invertFillers(fillers, startDate, endDate);
          expect(result.length).toEqual(0);
        });
      });

      describe('endDate is during last filler (would never happen therefore the loops breaks)', () => {
        test('should return 0 timeslots', () => {
          const fillers = [
            r(11, 0, 12, 0),
          ];

          const startDate = d(13, 0);
          const endDate = d(11, 30);

          const result = invertFillers(fillers, startDate, endDate);
          expect(result.length).toEqual(0);
        });
      });

      describe('endDate is after last filler', () => {
        test('should return 1 timeslot', () => {
          const fillers = [
            r(11, 0, 12, 0),
          ];

          const startDate = d(13, 0);
          const endDate = d(13, 30);

          const result = invertFillers(fillers, startDate, endDate);
          expect(result.length).toEqual(1);
          expect(result[0].startDate.toISOString()).toBe(d(13, 0).toISOString());
          expect(result[0].endDate.toISOString()).toBe(d(13, 30).toISOString());
        });
      });
    });
  });
});
