
import getMostPopularValue from '../../../../../server/lib/availabilities/helpers/getMostPopularValue';

describe('Availabilities Library', () => {
  describe('#getMostPopularValue', () => {
    test('should be a function', () => {
      expect(typeof getMostPopularValue).toBe('function');
    });

    test('should return undefined if no values present', () => {
      expect(getMostPopularValue([
        {},
      ], 'test')).toBe(null);
    });

    test('should return undefined if empty array', () => {
      expect(getMostPopularValue([], 'test')).toBe(null);
    });

    test('should return "cat"', () => {
      expect(getMostPopularValue([
        { i: 'cat' },
        { i: 'cat' },
        { i: 'dog' },
        { i: 'cat' },
      ], 'i')).toBe('cat');
    });

    test('should return "cat" even if tied', () => {
      expect(getMostPopularValue([
        { i: 'cat' },
        { i: 'dog' },
        { i: 'dog' },
        { i: 'cat' },
      ], 'i')).toBe('cat');
    });

    test('should be able to ignore objects that dont have the value', () => {
      expect(getMostPopularValue([
        { i: 'cat' },
        { i: 'dog' },
        {},
        { i: 'cat' },
      ], 'i')).toBe('cat');
    });
  });
});
