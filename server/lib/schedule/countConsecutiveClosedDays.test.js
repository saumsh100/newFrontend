
import { countConsecutiveClosedDays } from './countNextClosedDays';

describe('Schedule Library', () => {
  describe('#countConsecutiveClosedDays', () => {
    test('should be a function', () => {
      expect(typeof countConsecutiveClosedDays).toBe('function');
    });

    test('should return 0 for empty object', () => {
      expect(countConsecutiveClosedDays({})).toBe(0);
    });

    test('should throw error for null', () => {
      expect(() => countConsecutiveClosedDays(null)).toThrow();
    });

    test('should equal 0 if first day is not closed', () => {
      expect(countConsecutiveClosedDays({
        a: { isClosed: false },
        b: { isClosed: false },
        c: { isClosed: false },
      })).toBe(0);
    });

    test('should equal 1 if first day and third day are closed', () => {
      expect(countConsecutiveClosedDays({
        a: { isClosed: true },
        b: { isClosed: false },
        c: { isClosed: true },
      })).toBe(1);
    });

    test('should equal 3 of all 3 are closed', () => {
      expect(countConsecutiveClosedDays({
        a: { isClosed: true },
        b: { isClosed: true },
        c: { isClosed: true },
      })).toBe(3);
    });
  });
});
