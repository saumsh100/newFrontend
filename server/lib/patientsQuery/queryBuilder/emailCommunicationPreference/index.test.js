
import queryEmailCommunicationPreference from './';

describe('queryEmailCommunicationPreferenceTest', () => {
  test('should build a query when the boolean parameter inputted into the query is valid', () => {
    expect(queryEmailCommunicationPreference(
      true,
    ).where.preferences.emailNotifications).toBeTruthy(
    );
  });
});
