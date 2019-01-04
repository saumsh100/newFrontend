
import ageQuery from './';
import { prepareQueryParams } from './util';

jest.mock('./util');

describe('age query builder', () => {
  afterAll(() => {
    prepareQueryParams.restore();
  });

  test('default array param', () => {
    prepareQueryParams.mockReturnValue([
      '1988-01-31T23:00:00.000Z',
      '1998-01-31T23:00:00.000Z',
    ]);
    expect(ageQuery([20, 30])).toEqual({ where: { birthDate: { $between: ['1988-01-31T23:00:00.000Z', '1998-01-31T23:00:00.000Z'] } } });
  });

  test('greater than', () => {
    prepareQueryParams.mockReturnValue({ greaterThan: '1998-01-31T23:00:00.000Z' });
    expect(ageQuery({ greaterThan: 20 })).toEqual({ where: { birthDate: { $and: [{ $gt: '1998-01-31T23:00:00.000Z' }] } } });
  });

  test('raw greater than', () => {
    prepareQueryParams.mockReturnValue({ $gt: '1998-01-31T23:00:00.000Z' });
    expect(ageQuery({ $gt: 20 })).toEqual({ where: { birthDate: { $and: [{ $gt: '1998-01-31T23:00:00.000Z' }] } } });
  });

  test('raw between than', () => {
    prepareQueryParams.mockReturnValue({ $between: ['1988-01-31T23:00:00.000Z', '1998-01-31T23:00:00.000Z'] });
    expect(ageQuery({ $between: [20, 30] })).toEqual({
      where: {
        birthDate: {
          $and: [
            { $between: ['1988-01-31T23:00:00.000Z', '1998-01-31T23:00:00.000Z'] },
          ],
        },
      },
    });
  });

  test('multiple operators', () => {
    prepareQueryParams.mockReturnValue({
      greaterThan: '1998-01-31T23:00:00.000Z',
      lessThan: '1988-01-31T23:00:00.000Z',
    });

    expect(ageQuery({
      greaterThan: 20,
      lessThan: 30,
    })).toEqual({
      where: {
        birthDate: {
          $and: [
            { $gt: '1998-01-31T23:00:00.000Z' },
            { $lt: '1988-01-31T23:00:00.000Z' },
          ],
        },
      },
    });
  });
});
