import sortAsc from './index';

describe('sort asc arrays', () => {
  test('since 9 is higher than 1', () => {
    expect([9, 1].sort(sortAsc)).toEqual([1, 9]);
  });
  test('since Alfred is alphabetically higher than Adam', () => {
    expect(['Alfred', 'Adam'].sort(sortAsc)).toEqual(['Adam', 'Alfred']);
  });
  test('since "1" is higher than "0"', () => {
    expect(['1', '0'].sort(sortAsc)).toEqual(['0', '1']);
  });
});

describe('do not sort asc arrays', () => {
  test('when the passed array has different typeof values', () => {
    const errorMessage =
      "The typeof the value '10' is different than the value 'test', make sure that the array contains only equal type values";
    expect(() => [10, 'test'].sort(sortAsc)).toThrowError(errorMessage);
  });
});
