
import { setDateToTimezone } from '@carecru/isomorphic';
import dateTimeType, {
  AFTER,
  BEFORE,
  BETWEEN,
  EQUAL,
  RELATIVE_AFTER,
  RELATIVE_BEFORE,
  RELATIVE_BETWEEN,
} from './';

describe('relative type', () => {
  beforeAll(() => {
    jest
      .spyOn(Date, 'now')
      .mockImplementation(() => new Date(2018, 1, 1, 0, 0, 0));
  });

  test('5 days offset AFTER', () => {
    expect(dateTimeType(query => query)('5 days', RELATIVE_AFTER)).toEqual({
      $between: [
        new Date(2018, 1, 1).toISOString(),
        new Date(2018, 1, 6).toISOString(),
      ],
    });
  });

  test('5 days offset BEFORE', () => {
    expect(dateTimeType(query => query)('5 days', RELATIVE_BEFORE)).toEqual({
      $between: [
        new Date(2018, 0, 27).toISOString(),
        new Date(2018, 1, 1).toISOString(),
      ],
    });
  });

  test('5 days before and 5 days after BETWEEN', () => {
    expect(dateTimeType(query => query)(['5 days', '5 days'], RELATIVE_BETWEEN)).toEqual({
      $between: [
        new Date(2018, 0, 27).toISOString(),
        new Date(2018, 1, 6).toISOString(),
      ],
    });
  });

  test('afterRelative date', () => {
    expect(dateTimeType(query => query)({
      afterRelative: {
        interval: '10 day',
        date: new Date(2018, 11, 10).toISOString(),
      },
    })).toEqual({
      $and: [
        {
          $between: [
            new Date(2018, 11, 10).toISOString(),
            new Date(2018, 11, 20).toISOString(),
          ],
        },
      ],
    });
  });

  test('beforeRelative date', () => {
    expect(dateTimeType(query => query)({
      beforeRelative: {
        interval: '10 day',
        date: new Date(2018, 11, 15).toISOString(),
      },
    })).toEqual({
      $and: [
        {
          $between: [
            new Date(2018, 11, 5).toISOString(),
            new Date(2018, 11, 15).toISOString(),
          ],
        },
      ],
    });
  });

  test('betweenRelative date', () => {
    expect(dateTimeType(query => query)({
      beforeRelative: {
        interval: '10 day',
        date: new Date(2018, 11, 15).toISOString(),
      },
    })).toEqual({
      $and: [
        {
          $between: [
            new Date(2018, 11, 5).toISOString(),
            new Date(2018, 11, 15).toISOString(),
          ],
        },
      ],
    });
  });

  test('combined', () => {
    expect(dateTimeType(query => query)({
      beforeRelative: {
        interval: '10 day',
        date: new Date(2018, 11, 15).toISOString(),
      },
      afterRelative: {
        interval: '10 day',
        date: new Date(2018, 11, 10).toISOString(),
      },
    })).toEqual({
      $and: [
        {
          $between: [
            new Date(2018, 11, 5).toISOString(),
            new Date(2018, 11, 15).toISOString(),
          ],
        },
        {
          $between: [
            new Date(2018, 11, 10).toISOString(),
            new Date(2018, 11, 20).toISOString(),
          ],
        },
      ],
    });
  });

  test('raw works', () => {
    expect(dateTimeType(query => query)({
      $between: [
        new Date(2018, 11, 10).toISOString(),
        new Date(2018, 11, 20).toISOString(),
      ],
    })).toEqual({
      $and: [
        {
          $between: [
            new Date(2018, 11, 10).toISOString(),
            new Date(2018, 11, 20).toISOString(),
          ],
        },
      ],
    });
  });

  test('raw and operator', () => {
    expect(dateTimeType(query => query)({
      $between: [
        new Date(2018, 11, 10).toISOString(),
        new Date(2018, 11, 20).toISOString(),
      ],
      beforeRelative: {
        interval: '10 day',
        date: new Date(2018, 11, 15).toISOString(),
      },
    })).toEqual({
      $and: [
        {
          $between: [
            new Date(2018, 11, 10).toISOString(),
            new Date(2018, 11, 20).toISOString(),
          ],
        },
        {
          $between: [
            new Date(2018, 11, 5).toISOString(),
            new Date(2018, 11, 15).toISOString(),
          ],
        },
      ],
    });
  });
});

describe('dateTimeType', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 1, 1));
  });

  test('compares wtesth EQUAL', () => {
    expect(dateTimeType(query => query)(new Date(2018, 5, 5).toISOString(), EQUAL)).toEqual({ $eq: setDateToTimezone(new Date(2018, 5, 5)).toISOString() });
  });

  test('compares wtesth AFTER', () => {
    expect(dateTimeType(query => query)(new Date(2018, 5, 5).toISOString(), AFTER)).toEqual({ $gt: setDateToTimezone(new Date(2018, 5, 5)).toISOString() });
  });

  test('compares wtesth BEFORE', () => {
    expect(dateTimeType(query => query)(new Date(2018, 5, 5).toISOString(), BEFORE)).toEqual({ $lt: setDateToTimezone(new Date(2018, 5, 5)).toISOString() });
  });

  test('compares wtesth BETWEEN', () => {
    expect(dateTimeType(query => query)(
      [
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ],
      BETWEEN,
    )).toEqual({
      $between: [
        setDateToTimezone(new Date(2017, 1, 1)).toISOString(),
        setDateToTimezone(new Date(2019, 1, 1)).toISOString(),
      ],
    });
  });
});
