
/**
 * builds a query object for sequelize query based on the reviews preference
 * in the preferences field of the Patient model.
 * @param value boolean
 * @returns {{where: {preferences: {reviews: boolean}}}}
 */
export default function queryReviewCommunicationPreference(value) {
  return { where: { preferences: { reviews: value } } };
}
