
/**
 * builds a query object for sequelize query based on the sms preference
 * in the preferences field of the Patient model.
 * @param value boolean
 * @returns {{where: {preferences: {sms: boolean}}}}
 */
export default function querySmsCommunicationPreference(value) {
  return { where: { preferences: { sms: value } } };
}
