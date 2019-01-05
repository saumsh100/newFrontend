
import { relativeAfter, relativeBefore, relativeBetween, addRelativeTime } from './dateCalculations';

describe('date calculation', () => {
  beforeAll(() => {
    jest.spyOn(Date, 'now').mockImplementation(() => new Date(2018, 1, 1, 0, 0, 0));
  });

  it('addRelativeTime', () => {
    expect(addRelativeTime('4 days')).toEqual(new Date(2018, 1, 5).toISOString());
  });

  it('relativeAfter obj', () => {
    expect(relativeAfter({
      interval: '7 days',
      date: new Date(2018, 11, 10).toISOString(),
    })).toEqual({
      $between: [
        new Date(2018, 11, 10).toISOString(),
        new Date(2018, 11, 17).toISOString(),
      ],
    });
  });

  it('relativeAfter str', () => {
    expect(relativeAfter('7 days')).toEqual({
      $between: [
        new Date(2018, 1, 1).toISOString(),
        new Date(2018, 1, 8).toISOString(),
      ],
    });
  });

  it('relativeBefore obj', () => {
    expect(relativeBefore({
      interval: '5 days',
      date: new Date(2018, 11, 10).toISOString(),
    })).toEqual({
      $between: [
        new Date(2018, 11, 5).toISOString(),
        new Date(2018, 11, 10).toISOString(),
      ],
    });
  });

  it('relativeBefore str', () => {
    expect(relativeBefore('5 days')).toEqual({
      $between: [
        new Date(2018, 0, 27).toISOString(),
        new Date(2018, 1, 1).toISOString(),
      ],
    });
  });

  it('relativeBetween obj', () => {
    expect(relativeBetween({
      interval: ['5 days', '3 days'],
      date: new Date(2018, 5, 10).toISOString(),
    })).toEqual({
      $between: [
        new Date(2018, 5, 5).toISOString(),
        new Date(2018, 5, 13).toISOString(),
      ],
    });
  });

  it('relativeBetween array', () => {
    expect(relativeBetween(['3 days', '3 days'])).toEqual({
      $between: [
        new Date(2018, 0, 29).toISOString(),
        new Date(2018, 1, 4).toISOString(),
      ],
    });
  });
});
