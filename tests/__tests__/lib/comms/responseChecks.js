
import {
  getIndicesOf,
  isWordy,
  isNotInWord,
  isSmsConfirmationResponse,
} from '../../../../server/lib/comms/util/responseChecks';

describe('Communications Utility - Response Checks', () => {
  describe('getIndicesOf', () => {
    test('should be a function', () => {
      expect(typeof getIndicesOf).toBe('function');
    });

    test('should return true if on its own', () => {
      const text = 'C... thanks';
      expect(getIndicesOf(text, 'C')).toEqual([0]);
    });
  });

  describe('isWordy', () => {
    test('should be a function', () => {
      expect(typeof isWordy).toBe('function');
    });

    test('should return true', () => {
      expect(isWordy('C')).toEqual(true);
    });

    test('should return true', () => {
      expect(isWordy('C')).toEqual(true);
    });

    test('should return false', () => {
      expect(isWordy('.')).toEqual(false);
    });

    test('should return true', () => {
      expect(isWordy('9')).toEqual(true);
    });

    test('should return true', () => {
      expect(isWordy('a')).toEqual(true);
    });

    test('should return false', () => {
      expect(isWordy(' ')).toEqual(false);
    });
  });

  describe('isNotInWord', () => {
    test('should be a function', () => {
      expect(typeof isNotInWord).toBe('function');
    });

    test('should return true if on its own', () => {
      const text = 'C... thanks';
      expect(isNotInWord(text, 'C')).toBe(true);
    });

    test('should return true if completely equal to magic word', () => {
      const text = 'C';
      expect(isNotInWord(text, 'C')).toBe(true);
    });

    test('should return false if is in word Canada', () => {
      const text = 'Canada';
      expect(isNotInWord(text, 'C')).toBe(false);
    });

    test('should return false', () => {
      const text = 'I Can\'t make it, sorry Caroline';
      expect(isNotInWord(text, 'C')).toBe(false);
    });

    test('should return true', () => {
      const text = 'I Can\'t make it, sorry C';
      expect(isNotInWord(text, 'C')).toBe(true);
    });
  });

  describe('isSmsConfirmationResponse', () => {
    test('should be a function', () => {
      expect(typeof isSmsConfirmationResponse).toBe('function');
    });

    test('should return true if completely equal to magic word', () => {
      const text = 'C';
      expect(isSmsConfirmationResponse(text, 'C')).toBe(true);
    });

    test('should return false if has C but it is in words', () => {
      const text = 'I Can\'t make it, sorry Caroline';
      expect(isSmsConfirmationResponse(text, 'C')).toBe(false);
    });

    test('should return true if surrounded by spaces', () => {
      const text = ' C ';
      expect(isSmsConfirmationResponse(text, 'C')).toBe(true);
    });

    test('should return true', () => {
      const text = 'C... Thanks! Canada';
      expect(isSmsConfirmationResponse(text, 'C')).toBe(true);
    });

    test('should return false', () => {
      const text = 'Camera';
      expect(isSmsConfirmationResponse(text, 'C')).toBe(false);
    });

    test('should return true', () => {
      const text = '.......C';
      expect(isSmsConfirmationResponse(text, 'C')).toBe(true);
    });
  });
});
