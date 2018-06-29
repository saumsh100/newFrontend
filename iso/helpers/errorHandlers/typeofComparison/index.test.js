import typeofComparison from './index';

test('throw error when values are not the same typeof', () => {
  const valueA = 10;
  const valueB = 'test';

  const errorMessage = `The typeof the value '${valueA}' is different than the value '${valueB}', make sure that the array contains only equal type values`;
  expect(() => typeofComparison(valueA, valueB)).toThrowError(errorMessage);
});

test("don't throw anything if the values are the same typeof", () => {
  expect(typeofComparison(10, 0)).toBe(true);
});
