
import normalizeRequest from './util';

describe('timeOnly util', () => {
  test('string', () => {
    expect(normalizeRequest('16:00'))
      .toEqual(new Date(1970, 1, 0, 16, 0).toISOString());
  });

  test('array', () => {
    expect(normalizeRequest(['13:00', '16:00']))
      .toEqual([
        new Date(1970, 1, 0, 13, 0).toISOString(),
        new Date(1970, 1, 0, 16, 0).toISOString(),
      ]);
  });

  test('object', () => {
    expect(normalizeRequest({
      lessThan: '15:00',
      greaterThan: '19:00',
    })).toEqual({
      lessThan: new Date(1970, 1, 0, 15, 0).toISOString(),
      greaterThan: new Date(1970, 1, 0, 19, 0).toISOString(),
    });
  });

  test('object and array', () => {
    expect(normalizeRequest({ between: ['15:00', '19:00'] })).toEqual({
      between: [
        new Date(1970, 1, 0, 15, 0).toISOString(),
        new Date(1970, 1, 0, 19, 0).toISOString(),
      ],
    });
  });
});
