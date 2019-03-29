
import querySentRecalls from './';

describe('querySentRecallsTest', () => {
  test('should build the where clause of query for isSent recalls between the dates when dates are passed to the query', () => {
    expect(
      querySentRecalls([
        true,
        null,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0].where,
    ).toEqual({
      createdAt: {
        $between: [
          new Date(2017, 1, 1).toISOString(),
          new Date(2019, 1, 1).toISOString(),
        ],
      },
      isSent: true,
    });
  });

  test('should build the where clause of query for isAutomated isSent recalls between dates when dates are passed and isAutomated = true is passed to the query', () => {
    expect(
      querySentRecalls([
        true,
        true,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0].where,
    ).toEqual({
      createdAt: {
        $between: [
          new Date(2017, 1, 1).toISOString(),
          new Date(2019, 1, 1).toISOString(),
        ],
      },
      isSent: true,
      isAutomated: true,
    });
  });

  test('should build the required clause of the outer include clause of the query to be true when query is valid', () => {
    expect(
      querySentRecalls([
        true,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0].required,
    ).toBeTruthy();
  });
});
