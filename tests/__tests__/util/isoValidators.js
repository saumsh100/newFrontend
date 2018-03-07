
import { validateJsonString } from '../../../server/util/isoValidators';

describe('Isomorphic Validators', () => {
  describe('#validateJsonString', () => {
    test('it should be a function', () => {
      expect(typeof validateJsonString).toBe('function');
    });

    test('should return true for empty object', () => {
      expect(validateJsonString(
        '{}',
        ['a', 'c']
      )).toBe(true);
    });

    test('should return false for empty string', () => {
      expect(validateJsonString(
        '',
        ['a', 'c']
      )).toBe(false);
    });

    test('should return false for string', () => {
      expect(validateJsonString(
        'cat',
        ['a', 'c']
      )).toBe(false);
    });

    test('should return true for keys that are in the array', () => {
      expect(validateJsonString(
        '{ "a": 1, "b": 2 }',
        ['a', 'b']
      )).toBe(true);
    });

    test('should return false for keys that are not in the array', () => {
      expect(validateJsonString(
        '{ "a": 1, "b": 2 }',
        ['a', 'c']
      )).toBe(false);
    });
  });
});
