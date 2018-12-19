import signUrl from './modeAnalytics';

const MISSING_PARAM_ERROR_MESSAGE = 'Function parameter missing';
const INVALID_PARAM_ERROR_MESSAGE = 'Function parameter invalid';
const TIMESTAMP_NOT_NUMERIC_MESSAGE = 'Timestamp provided is not numeric';

describe('analytics tests', () => {

  describe('validation tests', () => {
    test('signUrl is a function', () => {
      expect(typeof signUrl).toBe('function');
    });

    test('signUrl should throw an error when url is not provided', () => {
      expect(() => {
        signUrl({
          url: null,
          method: 'a',
          key: 'a',
          secret: 'a',
          timestamp: 123,
        });
      }).toThrow(MISSING_PARAM_ERROR_MESSAGE);
    });

    test('signUrl should throw an error when key is not provided', () => {
      expect(() => {
        signUrl({
          url: 'a',
          method: 'a',
          key: null,
          secret: 'a',
          timestamp: 123,
        });
      }).toThrow(MISSING_PARAM_ERROR_MESSAGE);
    });

    test('signUrl should throw an error when secret is not provided', () => {
      expect(() => {
        signUrl({
          url: 'a',
          method: 'a',
          key: 'a',
          secret: null,
          timestamp: 123,
        });
      }).toThrow(MISSING_PARAM_ERROR_MESSAGE);
    });

    test('signUrl should throw an error when timestamp is not provided', () => {
      expect(() => {
        signUrl({
          url: 'a',
          method: 'a',
          key: 'a',
          secret: 'a',
          timestamp: null,
        });
      }).toThrow(MISSING_PARAM_ERROR_MESSAGE);
    });

    test('signUrl should throw an error when url is not string', () => {
      expect(() => {
        signUrl({
          url: 1,
          method: 'a',
          key: 'a',
          secret: 'a',
          timestamp: 123,
        });
      }).toThrow(INVALID_PARAM_ERROR_MESSAGE);
    });

    test('signUrl should throw an error when method is not string', () => {
      expect(() => {
        signUrl({
          url: 'a',
          method: 2,
          key: 'a',
          secret: 'a',
          timestamp: 123,
        });
      }).toThrow(INVALID_PARAM_ERROR_MESSAGE);
    });

    test('signUrl should throw an error when key is not string', () => {
      expect(() => {
        signUrl({
          url: 'a',
          method: 'a',
          key: 3,
          secret: 'a',
          timestamp: 123,
        });
      }).toThrow(INVALID_PARAM_ERROR_MESSAGE);
    });

    test('signUrl should throw an error when secret is not string', () => {
      expect(() => {
        signUrl({
          url: 'a',
          method: 'a',
          key: 'a',
          secret: 4,
          timestamp: 123,
        });
      }).toThrow(INVALID_PARAM_ERROR_MESSAGE);
    });

    test('signUrl should throw an error when timestamp is a string', () => {
      expect(() => {
        signUrl({
          url: 'a',
          method: 'a',
          key: 'a',
          secret: 'a',
          timestamp: '123',
        });
      }).toThrow(TIMESTAMP_NOT_NUMERIC_MESSAGE);
    });

    test('signUrl should throw an error when timestamp is a non-numeric string', () => {
      expect(() => {
        signUrl({
          url: 'a',
          method: 'a',
          key: 'a',
          secret: 'a',
          timestamp: 'abc',
        });
      }).toThrow(TIMESTAMP_NOT_NUMERIC_MESSAGE);
    });
  });

  describe('signing tests', () => {
    test('signUrl should return a string whenever valid input is provided', () => {
      expect(typeof signUrl({
        url: 'a',
        method: 'a',
        key: 'a',
        secret: 'a',
        timestamp: 123,
      })).toBe('string');
    });

    test('signUrl should return timestamp and signature appended to provided url when valid input is provided', () => {
      expect(signUrl({
        url: 'http://google.ca',
        method: 'GET',
        key: 'a1b2',
        secret: 'b12g',
        timestamp: 123456,
      })).toBe('http://google.ca&timestamp=123456' +
        '&signature=112a8bedba076c35e03d5f51ebe067c82155c38c7b485964f6cc018d273a15b2');
    });
  });
});
