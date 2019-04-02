
import queryCompletedPatientFollowUps from './';

describe('queryCompletedPatientFollowUpsTest', () => {
  test('should build the where clause of query for completed patient '
    + 'follow ups between the dates when dates are passed to the query', () => {
    expect(
      queryCompletedPatientFollowUps([
        true,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0].where,
    ).toEqual({
      dueAt: {
        $between: [
          new Date(2017, 1, 1).toISOString(),
          new Date(2019, 1, 1).toISOString(),
        ],
      },
      completedAt: { $ne: null },
    });
  });

  test('should build the required clause of the outer include '
    + 'clause of the query to be true when query is valid', () => {
    expect(
      queryCompletedPatientFollowUps([
        true,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0].required,
    ).toBeTruthy();
  });
});
