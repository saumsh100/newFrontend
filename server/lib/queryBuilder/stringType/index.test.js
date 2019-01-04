
import stringType, { CONTAINS, ENDS_WITH, STARTS_WITH, EQUAL } from './';

describe('QB stringType', () => {
  test('contains', () => {
    expect(stringType(query => query)('ic', CONTAINS)).toEqual({ $iLike: '%ic%' });
  });

  test('startsWith', () => {
    expect(stringType(query => query)('Br', STARTS_WITH)).toEqual({ $iLike: 'Br%' });
  });

  test('endsWith', () => {
    expect(stringType(query => query)('ous', ENDS_WITH)).toEqual({ $iLike: '%ous' });
  });

  test('equal', () => {
    expect(stringType(query => query)('Vader', EQUAL)).toEqual({ $eq: 'Vader' });
  });
});
