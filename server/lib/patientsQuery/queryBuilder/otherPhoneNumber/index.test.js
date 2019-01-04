
import otherPhoneNumberQuery from './';

describe('Query otherPhoneNumber', () => {
  it('builds the query with default comparator', () => {
    expect(otherPhoneNumberQuery('123')).toEqual({ where: { otherPhoneNumber: { $iLike: '123%' } } });
  });

  test('startsWith', () => {
    expect(otherPhoneNumberQuery({ startsWith: '123' })).toEqual({ where: { otherPhoneNumber: { $and: [{ $iLike: '123%' }] } } });
  });

  test('endsWith', () => {
    expect(otherPhoneNumberQuery({ endsWith: '123' })).toEqual({ where: { otherPhoneNumber: { $and: [{ $iLike: '%123' }] } } });
  });

  test('contains', () => {
    expect(otherPhoneNumberQuery({ contains: '123' })).toEqual({ where: { otherPhoneNumber: { $and: [{ $iLike: '%123%' }] } } });
  });

  test('equal', () => {
    expect(otherPhoneNumberQuery({ equal: '123' })).toEqual({ where: { otherPhoneNumber: { $and: [{ $eq: '123' }] } } });
  });
});
