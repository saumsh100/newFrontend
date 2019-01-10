
import { setDateToTimezone } from '@carecru/isomorphic';
import timeType, {
  AFTER,
  BEFORE,
  BETWEEN,
} from '.';

describe('timeType', () => {
  test('compares with AFTER', () => {
    expect(timeType(query => query)('16:00', AFTER)).toEqual({ $gt: setDateToTimezone(new Date(1970, 1, 0, 16, 0)).toISOString() });
  });

  test('compares with BEFORE', () => {
    expect(timeType(query => query)('16:00', BEFORE)).toEqual({ $lt: setDateToTimezone(new Date(1970, 1, 0, 16, 0)).toISOString() });
  });

  test('compares with BETWEEN', () => {
    expect(timeType(query => query)(
      [
        '13:00',
        '16:00',
      ],
      BETWEEN,
    )).toEqual({
      $between: [
        setDateToTimezone(new Date(1970, 1, 0, 13, 0)).toISOString(),
        setDateToTimezone(new Date(1970, 1, 0, 16, 0)).toISOString(),
      ],
    });
  });

  describe('comparator', () => {
    test('after', () => {
      expect(timeType(query => query)({ after: '16:00' }, BEFORE)).toEqual({ $and: [{ $gt: setDateToTimezone(new Date(1970, 1, 0, 16, 0)).toISOString() }] });
    });

    test('before', () => {
      expect(timeType(query => query)({ before: '16:00' }, BEFORE)).toEqual({ $and: [{ $lt: setDateToTimezone(new Date(1970, 1, 0, 16, 0)).toISOString() }] });
    });

    test('between', () => {
      expect(timeType(query => query)({ between: ['13:00', '16:00'] }, BEFORE)).toEqual({
        $and: [{
          $between: [
            setDateToTimezone(new Date(1970, 1, 0, 13, 0)).toISOString(),
            setDateToTimezone(new Date(1970, 1, 0, 16, 0)).toISOString(),
          ],
        }],
      });
    });
  });

  describe('raw operator', () => {
    test('$gt', () => {
      expect(timeType(query => query)({ $gt: '16:00' }, BEFORE)).toEqual({ $and: [{ $gt: setDateToTimezone(new Date(1970, 1, 0, 16, 0)).toISOString() }] });
    });

    test('$lt', () => {
      expect(timeType(query => query)({ $lt: '16:00' }, BEFORE)).toEqual({ $and: [{ $lt: setDateToTimezone(new Date(1970, 1, 0, 16, 0)).toISOString() }] });
    });

    test('$between', () => {
      expect(timeType(query => query)({ $between: ['13:00', '16:00'] }, BEFORE)).toEqual({
        $and: [{
          $between: [
            setDateToTimezone(new Date(1970, 1, 0, 13, 0)).toISOString(),
            setDateToTimezone(new Date(1970, 1, 0, 16, 0)).toISOString(),
          ],
        }],
      });
    });
  });
});
