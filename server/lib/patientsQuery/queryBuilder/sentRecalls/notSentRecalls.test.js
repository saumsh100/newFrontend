
import { SentRecall } from 'CareCruModels';
import queryNotSentRecalls from './';

describe('queryNotSentRecallsTest', () => {
  test('should build the include clause of query for not sentRecalls between the dates when dates are passed to the query', () => {
    expect(
      queryNotSentRecalls([
        false,
        null,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0],
    ).toEqual({
      model: SentRecall,
      as: 'sentRecalls',
      required: false,
      duplicating: false,
      attributes: [],
      where: {
        createdAt: {
          $between: [
            new Date(2017, 1, 1).toISOString(),
            new Date(2019, 1, 1).toISOString(),
          ],
        },
      },
    });
  });

  test('should build the where clause of query for not isAutomated isSent recalls between dates when dates are passed and isAutomated = false is passed to the query', () => {
    expect(
      queryNotSentRecalls([
        false,
        false,
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
      isAutomated: false,
    });
  });

  test('should build the group clause of query for not sent recalls when query parameters are valid', () => {
    expect(
      queryNotSentRecalls([
        false,
        null,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).group[0],
    ).toEqual('Patient.id');
  });

  test('should build the having clause of query for not isSent recalls when query parameters are valid', () => {
    expect(
      queryNotSentRecalls(
        [
          false,
          true,
          new Date(2017, 1, 1).toISOString(),
          new Date(2019, 1, 1).toISOString(),
        ],
      ).having[1],
    ).toEqual({
      attribute: {
        val:
          'count(CASE WHEN "sentRecalls"."isSent" = true then 1 else NULL END)',
      },
      comparator: '=',
      logic: { $eq: 0 },
    });
  });

  test('should build the required clause of the outer include clause of the query to be true when query is valid', () => {
    expect(
      queryNotSentRecalls([
        false,
        null,
        new Date(2017, 1, 1).toISOString(),
        new Date(2019, 1, 1).toISOString(),
      ]).include[0].required,
    ).toBeFalsy();
  });
});
