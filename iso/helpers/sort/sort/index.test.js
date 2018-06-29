import sort from './index';

describe('sort array of numbers', () => {
  const arrayOfNumbers = [10, 0, 5, -1, 99];
  const ascSortedResultOfNumber = [-1, 0, 5, 10, 99];
  const descSortedResultOfNumber = [99, 10, 5, 0, -1];

  test('to asc as a fallback when any params are passed', () => {
    expect(arrayOfNumbers.sort(sort())).toEqual(ascSortedResultOfNumber);
  });

  test('to asc when passing ASC (in uppercase) as param', () => {
    expect(arrayOfNumbers.sort(sort('ASC'))).toEqual(ascSortedResultOfNumber);
  });

  test('to desc when passing desc as param', () => {
    expect(arrayOfNumbers.sort(sort('desc'))).toEqual(descSortedResultOfNumber);
  });

  test('to desc when passing anything other than asc', () => {
    expect(arrayOfNumbers.sort(sort('carecru'))).toEqual(descSortedResultOfNumber);
  });
});

describe('sort array of strings', () => {
  const arrayOfNames = ['Ramon', 'JD', 'Justin', 'Lucas', 'Gavin'];
  const ascSortedResultOfNames = ['Gavin', 'JD', 'Justin', 'Lucas', 'Ramon'];
  const descSortedResultOfNames = ['Ramon', 'Lucas', 'Justin', 'JD', 'Gavin'];

  test('to asc as a fallback when any params are passed', () => {
    expect(arrayOfNames.sort(sort())).toEqual(ascSortedResultOfNames);
  });

  test('to asc when passing ASC (in uppercase) as param', () => {
    expect(arrayOfNames.sort(sort('ASC'))).toEqual(ascSortedResultOfNames);
  });

  test('to desc when passing desc as param', () => {
    expect(arrayOfNames.sort(sort('desc'))).toEqual(descSortedResultOfNames);
  });

  test('to desc when passing anything other than asc', () => {
    expect(arrayOfNames.sort(sort('carecru'))).toEqual(descSortedResultOfNames);
  });
});

describe('sort arrays of objects', () => {
  const arrayOfObjectsContainingNumbers = [
    { patient: { insuranceCarrier: { id: 30 } } },
    { patient: { insuranceCarrier: { id: 15 } } },
    { patient: { insuranceCarrier: { id: 99 } } },
  ];
  test('in the asc way using the id key on the objects', () => {
    expect(arrayOfObjectsContainingNumbers.sort((
      {
        patient: {
          insuranceCarrier: { id: a },
        },
      },
      {
        patient: {
          insuranceCarrier: { id: b },
        },
      },
    ) => sort()(a, b))).toEqual([
      { patient: { insuranceCarrier: { id: 15 } } },
      { patient: { insuranceCarrier: { id: 30 } } },
      { patient: { insuranceCarrier: { id: 99 } } },
    ]);
  });
  const arrayOfObjectsContainingStrings = [{ name: 'Ramon' }, { name: 'Ao' }, { name: 'Alice' }];
  test('in the desc way using the name key on the objects', () => {
    expect(arrayOfObjectsContainingStrings.sort(({ name: a }, { name: b }) => sort('desc')(a, b))).toEqual([{ name: 'Ramon' }, { name: 'Ao' }, { name: 'Alice' }]);
  });
});

describe('do not sort arrays of objects', () => {
  test('when the passed array has different typeof values', () => {
    const errorMessage =
      "The typeof the value '3' is different than the value '0', make sure that the array contains only equal type values";
    expect(() =>
      [{ id: 3 }, { id: '0' }].sort(({ id: a }, { id: b }) => sort()(a, b))).toThrowError(errorMessage);
  });
});
