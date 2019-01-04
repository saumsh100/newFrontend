
import emailQuery from './';

describe('Query Email', () => {
  it('builds the query with default comparator', () => {
    expect(emailQuery('xsa')).toEqual({ where: { email: { $iLike: '%xsa%' } } });
  });

  test('startsWith', () => {
    expect(emailQuery({ startsWith: 'asd'})).toEqual({ where: { email: { $and: [{ $iLike: 'asd%' }] } } });
  });

  test('endsWith', () => {
    expect(emailQuery({ endsWith: 'asd'})).toEqual({ where: { email: { $and: [{ $iLike: '%asd' }] } } });
  });

  test('contains', () => {
    expect(emailQuery({ contains: 'asd'})).toEqual({ where: { email: { $and: [{ $iLike: '%asd%' }] } } });
  });

  test('equal', () => {
    expect(emailQuery({ equal: 'asd'})).toEqual({ where: { email: { $and: [{ $eq: 'asd' }] } } });
  });
});
