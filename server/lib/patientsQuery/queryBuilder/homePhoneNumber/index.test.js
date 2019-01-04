
import homePhoneNumberQuery from './';

describe('Query homePhoneNumber', () => {
  it('builds the query with default comparator', () => {
    expect(homePhoneNumberQuery('123')).toEqual({ where: { homePhoneNumber: { $iLike: '123%' } } });
  });

  test('startsWith', () => {
    expect(homePhoneNumberQuery({ startsWith: '123' })).toEqual({ where: { homePhoneNumber: { $and: [{ $iLike: '123%' }] } } });
  });

  test('endsWith', () => {
    expect(homePhoneNumberQuery({ endsWith: '123' })).toEqual({ where: { homePhoneNumber: { $and: [{ $iLike: '%123' }] } } });
  });

  test('contains', () => {
    expect(homePhoneNumberQuery({ contains: '123' })).toEqual({ where: { homePhoneNumber: { $and: [{ $iLike: '%123%' }] } } });
  });

  test('equal', () => {
    expect(homePhoneNumberQuery({ equal: '123' })).toEqual({ where: { homePhoneNumber: { $and: [{ $eq: '123' }] } } });
  });
});
