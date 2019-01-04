
import composeKeyValueStructureOfQuery from './';

const comparators = {
  GREATER_THAN: '$gt',
  LESS_THAN: '$lt',
  BETWEEN: '$between',
  EQUALS: '$eq',
};

const operators = {
  $gt: true,
  $lt: true,
  $between: true,
  $eq: true,
};

describe('composeKeyValueStructureOfQuery', () => {
  it('filters out unexisting comparator/operator', () => {
    expect(() => composeKeyValueStructureOfQuery({ MORE: 3 }, comparators, operators))
      .toThrow('Operator MORE is not supported');
  });

  it('generates object from comparator', () => {
    expect(composeKeyValueStructureOfQuery({ GREATER_THAN: 3 }, comparators, operators))
      .toEqual({ $and: [{ $gt: 3 }] });
  });

  it('generates object from operator', () => {
    expect(composeKeyValueStructureOfQuery({ $gt: 3 }, comparators, operators))
      .toEqual({ $and: [{ $gt: 3 }] });
  });

  it('works with both together', () => {
    expect(composeKeyValueStructureOfQuery({
      $gt: 3,
      LESS_THAN: 5,
    }, comparators, operators))
      .toEqual({
        $and: [
          { $gt: 3 },
          { $lt: 5 },
        ],
      });
  });

  it('raw operator stacks with comparator', () => {
    expect(composeKeyValueStructureOfQuery({
      GREATER_THAN: 5,
      $gt: 3,
    }, comparators, operators))
      .toEqual({ $and: [{ $gt: 5 }, { $gt: 3 }] });
  });

  it('raw operator stacks with comparator doesnt matter the order', () => {
    expect(composeKeyValueStructureOfQuery({
      $gt: 3,
      GREATER_THAN: 5,
    }, comparators, operators))
      .toEqual({ $and: [{ $gt: 3 }, { $gt: 5 }] });
  });
});
