
import queryIncludeMerger from './queryIncludeMerger';

describe('#queryIncludeMerger', () => {
  test('it is a function', () => {
    expect(typeof queryIncludeMerger).toBe('function');
  });

  test('should sort the array', () => {
    expect(queryIncludeMerger([{ as: 'second' }, { as: 'first' }])).toEqual([
      { as: 'first' },
      { as: 'second' },
    ]);
  });

  test('expect to throw Error when params does not have \'as\' attribute', () => {
    expect(() => queryIncludeMerger(['second']))
      .toThrow('Argument should be an array of include objects');
  });

  test('expect to throw Error when argument is not an arrya of objects', () => {
    expect(() => queryIncludeMerger([{ notAs: 'something' }]))
      .toThrow('Include objects should have "as" attribute');
  });

  test('should merge object with the same "as" attribute the array', () => {
    const mockInclude = [
      {
        as: 'appointment',
        att1: true,
      },
      {
        as: 'appointment',
        att2: true,
      },
      {
        as: 'requests',
        att1: true,
      },
    ];

    expect(queryIncludeMerger(mockInclude)).toEqual([
      {
        as: 'appointment',
        att1: true,
        att2: true,
      },
      {
        as: 'requests',
        att1: true,
      },
    ]);
  });

  test('should merge multiple objects', () => {
    const mockInclude = [
      {
        as: 'appointment',
        att1: true,
      },
      {
        as: 'appointment',
        att2: true,
      },
      {
        as: 'appointment',
        att3: true,
      },
      {
        as: 'appointment',
        att4: true,
      },
      {
        as: 'requests',
        att1: true,
      },
      {
        as: 'requests',
        att2: true,
      },
      {
        as: 'requests',
        att3: true,
      },
    ];

    expect(queryIncludeMerger(mockInclude)).toEqual([
      {
        as: 'appointment',
        att1: true,
        att2: true,
        att3: true,
        att4: true,
      },
      {
        as: 'requests',
        att1: true,
        att2: true,
        att3: true,
      },
    ]);
  });
});
