
import mobilePhoneNumberQuery from './';

describe('Query mobilePhoneNumber', () => {
  it('builds the query with default comparator', () => {
    expect(mobilePhoneNumberQuery('123')).toEqual({ where: { mobilePhoneNumber: { $iLike: '123%' } } });
  });

  test('startsWith', () => {
    expect(mobilePhoneNumberQuery({ startsWith: '123' })).toEqual({ where: { mobilePhoneNumber: { $and: [{ $iLike: '123%' }] } } });
  });

  test('endsWith', () => {
    expect(mobilePhoneNumberQuery({ endsWith: '123' })).toEqual({ where: { mobilePhoneNumber: { $and: [{ $iLike: '%123' }] } } });
  });

  test('contains', () => {
    expect(mobilePhoneNumberQuery({ contains: '123' })).toEqual({ where: { mobilePhoneNumber: { $and: [{ $iLike: '%123%' }] } } });
  });

  test('equal', () => {
    expect(mobilePhoneNumberQuery({ equal: '123' })).toEqual({ where: { mobilePhoneNumber: { $and: [{ $eq: '123' }] } } });
  });
});
