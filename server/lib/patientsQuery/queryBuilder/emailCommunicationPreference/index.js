
/**
 * builds a query object for sequelize query based on the emailNotifications preference
 * in the preferences field of the Patient model.
 * @param value boolean
 * @returns {{where: {preferences: {emailNotifications: boolean}}}}
 */
export default function queryEmailCommunicationPreference(value) {
  return { where: { preferences: { emailNotifications: value } } };
}
