
import queryPhoneCommunicationPreference from './';

describe('queryPhoneCommunicationPreferenceTest', () => {
  test('should build a query when the boolean parameter inputted into the query is valid', () => {
    expect(queryPhoneCommunicationPreference(
      true,
    ).where.preferences.phone).toBeTruthy(
    );
  });
});
