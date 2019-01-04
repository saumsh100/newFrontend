
import numberType, { GREATER_THAN, EQUALS, LESS_THAN, BETWEEN } from './';

describe('numberType', () => {
  it('it defaults comparator to Equals', () => {
    expect(numberType(query => query)(23)).toEqual({ $eq: 23 });
  });

  it('compares with GREATER_THAN', () => {
    expect(numberType(query => query)(23, GREATER_THAN)).toEqual({ $gt: 23 });
  });

  it('compares with EQUALS', () => {
    expect(numberType(query => query)(23, EQUALS)).toEqual({ $eq: 23 });
  });

  it('compares with LESS_THAN', () => {
    expect(numberType(query => query)(23, LESS_THAN)).toEqual({ $lt: 23 });
  });

  it('compares with BETWEEN', () => {
    expect(numberType(query => query)([10, 15], BETWEEN)).toEqual({ $between: [10, 15] });
  });
});
