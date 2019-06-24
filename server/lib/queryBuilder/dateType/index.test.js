
import moment from 'moment-timezone';
import { setDateToTimezone, nowToIso } from '@carecru/isomorphic';
import dateType, {
  AFTER,
  BEFORE,
  BETWEEN,
  EQUAL,
  RELATIVE_AFTER,
  RELATIVE_BEFORE,
} from ".";

jest.mock('@carecru/isomorphic');

describe.skip('relative type', () => {
  beforeAll(() => {
    setDateToTimezone.mockImplementation(v => moment(v));
    nowToIso.mockReturnValue(new Date(2018, 1, 1).toISOString());
  });

  test('After', () => {
    expect(dateType(query => query)('1965-11-16', AFTER)).toEqual({ $gt: new Date(1965, 10, 16, 23, 59, 59, 999).toISOString() });
  });

  test('Before', () => {
    expect(dateType(query => query)('1965-11-16', BEFORE)).toEqual({ $lt: new Date(1965, 10, 16, 0, 0, 0, 0).toISOString() });
  });

  test('Equal', () => {
    expect(dateType(query => query)('1965-11-16', EQUAL)).toEqual({
      $between: [
        new Date(1965, 10, 16, 0, 0, 0, 0).toISOString(),
        new Date(1965, 10, 16, 23, 59, 59, 999).toISOString(),
      ],
    });
  });

  test('Between', () => {
    expect(dateType(query => query)(['1965-11-16', '1970-11-18'], BETWEEN)).toEqual({
      $between: [
        new Date(1965, 10, 16, 0, 0, 0, 0).toISOString(),
        new Date(1970, 10, 18, 23, 59, 59, 999).toISOString(),
      ],
    });
  });

  it('5 days offset AFTER', () => {
    expect(dateType(query => query)('5 days', RELATIVE_AFTER)).toEqual({
      $between: [
        new Date(2018, 1, 1, 0, 0, 0, 0).toISOString(),
        new Date(2018, 1, 6, 23, 59, 59, 999).toISOString(),
      ],
    });
  });

  it('3 days offset BEFORE', () => {
    expect(dateType(query => query)('3 days', RELATIVE_BEFORE)).toEqual({
      $between: [
        new Date(2018, 0, 29, 0, 0, 0, 0).toISOString(),
        new Date(2018, 1, 1, 23, 59, 59, 999).toISOString(),
      ],
    });
  });

  test('betweenRelative date', () => {
    expect(dateType(query => query)({
      betweenRelative: {
        interval: ['10 days', '5 days'],
        date: '2018-12-15',
      },
    })).toEqual({
      $and: [
        {
          $between: [
            new Date(2018, 11, 5, 0, 0, 0).toISOString(),
            new Date(2018, 11, 20, 23, 59, 59, 999).toISOString(),
          ],
        },
      ],
    });
  });
});
