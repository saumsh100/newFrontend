
import queryReminderCommunicationPreference from './';

describe('queryReminderCommunicationPreferenceTest', () => {
  test('should build a query when the boolean parameter inputted into the query is valid', () => {
    expect(queryReminderCommunicationPreference(
      true,
    ).where.preferences.reminders).toBeTruthy(
    );
  });
});
