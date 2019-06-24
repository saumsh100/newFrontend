
import {
  getIndicesOf,
  isWordy,
  isNotInWord,
  wordCheck,
  isSmsConfirmationResponse,
  handleResponse,
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

  describe('wordCheck', () => {
    test('should be a function', () => {
      expect(typeof wordCheck).toBe('function');
    });

    test('should return true if completely equal to magic word', () => {
      const text = 'C';
      expect(wordCheck(text, 'C')).toBe(true);
    });

    test('should return false if has C but it is in words', () => {
      const text = 'I Can\'t make it, sorry Caroline';
      expect(wordCheck(text, 'C')).toBe(false);
    });

    test('should return true if surrounded by spaces', () => {
      const text = ' C ';
      expect(wordCheck(text, 'C')).toBe(true);
    });

    test('should return true', () => {
      const text = 'C... Thanks! Canada';
      expect(wordCheck(text, 'C')).toBe(true);
    });

    test('should return false', () => {
      const text = 'Camera';
      expect(wordCheck(text, 'C')).toBe(false);
    });

    test('should return true', () => {
      const text = '.......C';
      expect(wordCheck(text, 'C')).toBe(true);
    });
  });

  describe('isSmsConfirmationResponse', () => {
    test('should return true', () => {
      const text = 'c';
      expect(isSmsConfirmationResponse(text, 'C')).toBe(true);
    });

    test('should return true', () => {
      const text = 'c';
      expect(isSmsConfirmationResponse(text, { C: true })).toBe(true);
    });

    test('should return true', () => {
      const text = 'y';
      expect(isSmsConfirmationResponse(text, {
        C: true,
        Y: true,
      })).toBe(true);
    });

    test('should return false', () => {
      const text = 'yes';
      expect(isSmsConfirmationResponse(text, {
        C: true,
        Y: true,
      })).toBe(false);
    });

    test('should return true', () => {
      const text = 'Y... Great!';
      expect(isSmsConfirmationResponse(text, {
        C: true,
        Y: true,
      })).toBe(true);
    });

    test('should return false', () => {
      const text = "Y'all!";
      expect(isSmsConfirmationResponse(text, {
        C: true,
        Y: true,
      })).toBe(false);
    });

    test('should return false', () => {
      const text = "all'y";
      expect(isSmsConfirmationResponse(text, {
        C: true,
        Y: true,
      })).toBe(false);
    });
  });

  describe('isOnlyConfirmation', () => {
    test('confirmation only with no additional text', () => {
      const result = handleResponse('C');
      expect(result.isConfirmation).toBe(true);
      expect(result.haveExtraMessage).toBe(false);
    });

    test('confirmation with additional text', () => {
      const result = handleResponse('C do I need anything else?');
      expect(result.isConfirmation).toBe(true);
      expect(result.haveExtraMessage).toBe(true);
    });

    test('confiramtion with extra chars before', () => {
      const result = handleResponse('........C');
      expect(result.isConfirmation).toBe(true);
      expect(result.haveExtraMessage).toBe(false);
    });

    test('confiramtion with extra chars after', () => {
      const result = handleResponse('C........');
      expect(result.isConfirmation).toBe(true);
      expect(result.haveExtraMessage).toBe(false);
    });

    test('no confiramtion just text', () => {
      const result = handleResponse('CCan I bring something else?');
      expect(result.isConfirmation).toBe(false);
      expect(result.haveExtraMessage).toBe(true);
    });

    test('blank space', () => {
      const result = handleResponse(' ');
      expect(result.isConfirmation).toBe(false);
      expect(result.haveExtraMessage).toBe(true);
    });

    // at this point we can assume every other behaviour works with this as well
    test('should confirm using the cyrillic "es"', () => {
      const result = handleResponse('\u0421'); // Uppercase "es"
      expect(result.isConfirmation).toBe(true);
      expect(result.haveExtraMessage).toBe(false);

      const result2 = handleResponse('\u0441'); // lowercase "es"
      expect(result2.isConfirmation).toBe(true);
      expect(result2.haveExtraMessage).toBe(false);
    });
  });
});
