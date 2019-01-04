
import lastNameQuery from './';

describe('Query lastName', () => {
  it('builds the query with default comparator', () => {
    expect(lastNameQuery('xsa')).toEqual({ where: { lastName: { $iLike: 'xsa%' } } });
  });

  test('startsWith', () => {
    expect(lastNameQuery({ startsWith: 'asd'})).toEqual({ where: { lastName: { $and: [{ $iLike: 'asd%' }] } } });
  });

  test('endsWith', () => {
    expect(lastNameQuery({ endsWith: 'asd'})).toEqual({ where: { lastName: { $and: [{ $iLike: '%asd' }] } } });
  });

  test('contains', () => {
    expect(lastNameQuery({ contains: 'asd'})).toEqual({ where: { lastName: { $and: [{ $iLike: '%asd%' }] } } });
  });

  test('equal', () => {
    expect(lastNameQuery({ equal: 'asd'})).toEqual({ where: { lastName: { $and: [{ $eq: 'asd' }] } } });
  });
});
