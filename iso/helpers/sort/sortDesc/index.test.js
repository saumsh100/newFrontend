import sortDesc from './index';

describe('sort desc arrays', () => {
  test('since 1 is lower than 9', () => {
    expect([1, 9].sort(sortDesc)).toEqual([9, 1]);
  });
  test('since Adam is alphabetically before than Alfred', () => {
    expect(['Alfred', 'Adam'].sort(sortDesc)).toEqual(['Alfred', 'Adam']);
  });
  test('since "1" is higher than "0"', () => {
    expect(['1', '0'].sort(sortDesc)).toEqual(['1', '0']);
  });
});

describe('do not sort arrays', () => {
  test('when the passed array has different typeof values', () => {
    const errorMessage =
      "The typeof the value '10' is different than the value 'test', make sure that the array contains only equal type values";
    expect(() => [10, 'test'].sort(sortDesc)).toThrowError(errorMessage);
  });
});
