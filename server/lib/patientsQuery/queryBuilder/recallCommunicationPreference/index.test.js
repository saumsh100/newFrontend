
import queryRecallCommunicationPreference from './';

describe('queryRecallCommunicationPreferenceTest', () => {
  test('should build a query when the boolean parameter inputted into the query is valid', () => {
    expect(queryRecallCommunicationPreference(
      true,
    ).where.preferences.recalls).toBeTruthy(
    );
  });
});
