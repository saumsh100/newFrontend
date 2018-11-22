
import dateMock from 'CareCruIso/utils/test/dateMock';
import reduceQueryParamsToObject, { defaultQueryAccumulator } from './reduceQueryParamsToObject';

describe('#reduceQueryParamsToObject', () => {
  dateMock();

  test('it is a function', () => {
    expect(typeof reduceQueryParamsToObject).toBe('function');
  });

  test('defaultQueryAccumulator is the expected format', () => {
    expect(defaultQueryAccumulator).toEqual({
      attributes: [],
      having: [],
      queryOpts: {},
    });
  });

  test('expect key to be valid, supported query function', () => {
    const mock = { notValid: 'query' };

    expect(() => Object.entries(mock).reduce(reduceQueryParamsToObject, defaultQueryAccumulator))
      .toThrow('Key \'notValid\' is not supported');
  });

  test('merges simple queries to the query object', () => {
    const mock = {
      firstName: 'Aiden',
      lastName: 'Considine',
      age: [1, 2],
      city: 'Calgary',
      gender: 'Female',
    };

    const query = Object.entries(mock).reduce(reduceQueryParamsToObject, defaultQueryAccumulator);
    expect(query.queryOpts).toMatchSnapshot();
    expect(query.attributes).toHaveLength(0);
    expect(query.having).toHaveLength(0);
  });

  test('extract attributes and having into different attributes on the query object', () => {
    const mock = { bookedAppointments: ['>', 0] };
    const query = Object.entries(mock).reduce(reduceQueryParamsToObject, defaultQueryAccumulator);

    expect(query.queryOpts).toMatchSnapshot();
    expect(query.attributes).toHaveLength(1);
    expect(query.having).toHaveLength(2);
    expect(query.having[0]).toEqual({});
  });

  test('can merge multiple join queries', () => {
    const mock = {
      production: [0, 10],
      bookedAppointments: ['>', 0],
      onlineAppointments: ['>', 0],
      lastReminder: ['2018-11-10', '2018-12-10'],
      lastRecall: ['2018-11-10', '2018-12-10'],
      reviews: ['2018-11-10', '2018-12-10'],
    };

    const query = Object.entries(mock).reduce(reduceQueryParamsToObject, defaultQueryAccumulator);

    expect(query.queryOpts).toMatchSnapshot();
    expect(query.attributes).toHaveLength(5);
    expect(query.having).toHaveLength(10);
    expect(query.having[0]).toEqual({});
  });
});
