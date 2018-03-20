import {
  getProperDateWithZone,
} from '../../../server/util/time';

describe('util/time', () => {
  describe('#getProperDateWithZone', () => {
    test('should be a function', () => {
      expect(typeof getProperDateWithZone).toBe('function');
    });

    test('should return 2018-03-19 when New York', async () => {
      const date = getProperDateWithZone('2018-03-19T04:54:18.572Z', 'America/New_York');
      expect(date).toBe('2018-03-19');
    });

    test('should return 2018-03-18 when Vancouver', async () => {
      const date = getProperDateWithZone('2018-03-19T04:54:18.572Z', 'America/Vancouver');
      expect(date).toBe('2018-03-18');
    });

    test('should return 2018-03-19 when London', async () => {
      const date = getProperDateWithZone('2018-03-19T04:54:18.572Z', 'Europe/London');
      expect(date).toBe('2018-03-19');
    });
  });
});

