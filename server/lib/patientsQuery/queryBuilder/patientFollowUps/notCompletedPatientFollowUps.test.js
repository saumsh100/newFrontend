
import omit from 'lodash/omit';
import queryNotCompletedPatientFollowUps from './';

describe('queryNotCompletedPatientFollowUpsTest', () => {
  test(
    'should build the include clause of query for not completed ' +
      'Patient Follow Ups between the dates when dates are passed to the' +
      ' query',
    () => {
      expect(
        omit(queryNotCompletedPatientFollowUps([
          false,
          new Date(2017, 1, 1).toISOString(),
          new Date(2019, 1, 1).toISOString(),
        ]).include[0], ['model', 'as', 'attributes']),
      ).toEqual({
        required: true,
        duplicating: false,
        where: {
          completedAt: { $eq: null },
          dueAt: {
            $between: [
              new Date(2017, 1, 1).toISOString(),
              new Date(2019, 1, 1).toISOString(),
            ],
          },
        },
      });
    },
  );

  test(
    'should build the group clause of query for not completed' +
      'Patient Follow Ups when query parameters are valid',
    () => {
      expect(
        queryNotCompletedPatientFollowUps([
          false,
          new Date(2017, 1, 1).toISOString(),
          new Date(2019, 1, 1).toISOString(),
        ]).group[0],
      ).toEqual('Patient.id');
    },
  );

  test(
    'should build the required clause of the outer include clause ' +
      'of the query to be true when query is valid',
    () => {
      expect(
        queryNotCompletedPatientFollowUps([
          false,
          new Date(2017, 1, 1).toISOString(),
          new Date(2019, 1, 1).toISOString(),
        ]).include[0].required,
      ).toBeTruthy();
    },
  );
});
