
import composeKeyValueStructureOfQuery from './';

const comparators = {
  GREATER_THAN: '$gt',
  LESS_THAN: '$lt',
  BETWEEN: '$between',
  EQUALS: '$eq',
  STARTS_WITH: word => ({ $iLike: `${word}%` }),
  ENDS_WITH: word => ({ $iLike: `%${word}` }),
};

const operators = {
  $gt: true,
  $lt: true,
  $between: true,
  $eq: true,
  $iLike: true,
};

describe('composeKeyValueStructureOfQuery', () => {
  describe('number', () => {
    it('throws for unexisting comparator/operator', () => {
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

  describe('string', () => {
    it('throws for unexisting comparator/operator', () => {
      expect(() => composeKeyValueStructureOfQuery({ MORE: '3' }, comparators, operators))
        .toThrow('Operator MORE is not supported');
    });

    it('generates a correct query when we use function generator', () => {
      expect(composeKeyValueStructureOfQuery({ STARTS_WITH: 'qwe' }, comparators, operators))
        .toEqual({ $and: [{ $iLike: 'qwe%' }] });
    });

    it('generates a correct query with multiple like queries', () => {
      expect(composeKeyValueStructureOfQuery({
        STARTS_WITH: 'qwe',
        ENDS_WITH: 'asd',
      }, comparators, operators))
        .toEqual({
          $and: [
            { $iLike: 'qwe%' },
            { $iLike: '%asd' },
          ],
        });
    });

    it('generates object from comparator', () => {
      expect(composeKeyValueStructureOfQuery({ STARTS_WITH: 'asd' }, comparators, operators))
        .toEqual({ $and: [{ $iLike: 'asd%' }] });
    });

    it('generates object from operator', () => {
      expect(composeKeyValueStructureOfQuery({ $iLike: 'rr%' }, comparators, operators))
        .toEqual({ $and: [{ $iLike: 'rr%' }] });
    });

    it('works with both together', () => {
      expect(composeKeyValueStructureOfQuery({
        $iLike: 're%',
        ENDS_WITH: 'qw',
      }, comparators, operators))
        .toEqual({
          $and: [
            { $iLike: 're%' },
            { $iLike: '%qw' },
          ],
        });
    });
  });
});
