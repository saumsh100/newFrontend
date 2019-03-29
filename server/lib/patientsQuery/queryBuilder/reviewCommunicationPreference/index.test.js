
import queryReviewCommunicationPreference from './';

describe('queryReviewCommunicationPreferenceTest', () => {
  test('should build a query when the boolean parameter inputted into the query is valid', () => {
    expect(queryReviewCommunicationPreference(
      true,
    ).where.preferences.reviews).toBeTruthy(
    );
  });
});
