
import workPhoneNumberQuery from './';

describe('Query workPhoneNumber', () => {
  it('builds the query with default comparator', () => {
    expect(workPhoneNumberQuery('123')).toEqual({ where: { workPhoneNumber: { $iLike: '123%' } } });
  });

  test('startsWith', () => {
    expect(workPhoneNumberQuery({ startsWith: '123' })).toEqual({ where: { workPhoneNumber: { $and: [{ $iLike: '123%' }] } } });
  });

  test('endsWith', () => {
    expect(workPhoneNumberQuery({ endsWith: '123' })).toEqual({ where: { workPhoneNumber: { $and: [{ $iLike: '%123' }] } } });
  });

  test('contains', () => {
    expect(workPhoneNumberQuery({ contains: '123' })).toEqual({ where: { workPhoneNumber: { $and: [{ $iLike: '%123%' }] } } });
  });

  test('equal', () => {
    expect(workPhoneNumberQuery({ equal: '123' })).toEqual({ where: { workPhoneNumber: { $and: [{ $eq: '123' }] } } });
  });
});
