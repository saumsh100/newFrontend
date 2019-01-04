
import firstNameQuery from './';

describe('Query Firstname', () => {
  it('builds the query with default comparator', () => {
    expect(firstNameQuery('xsa')).toEqual({ where: { firstName: { $iLike: 'xsa%' } } });
  });

  test('startsWith', () => {
    expect(firstNameQuery({ startsWith: 'asd'})).toEqual({ where: { firstName: { $and: [{ $iLike: 'asd%' }] } } });
  });

  test('endsWith', () => {
    expect(firstNameQuery({ endsWith: 'asd'})).toEqual({ where: { firstName: { $and: [{ $iLike: '%asd' }] } } });
  });

  test('contains', () => {
    expect(firstNameQuery({ contains: 'asd'})).toEqual({ where: { firstName: { $and: [{ $iLike: '%asd%' }] } } });
  });

  test('equal', () => {
    expect(firstNameQuery({ equal: 'asd'})).toEqual({ where: { firstName: { $and: [{ $eq: 'asd' }] } } });
  });
});
