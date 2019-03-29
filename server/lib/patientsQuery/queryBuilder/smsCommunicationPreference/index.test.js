
import querySmsCommunicationPreference from './';

describe('querySmsCommunicationPreferenceTest', () => {
  test('should build a query when the boolean parameter inputted into the query is valid', () => {
    expect(querySmsCommunicationPreference(
      true,
    ).where.preferences.sms).toBeTruthy(
    );
  });
});
