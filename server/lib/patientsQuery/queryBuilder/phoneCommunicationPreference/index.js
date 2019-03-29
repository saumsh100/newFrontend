
/**
 * builds a query object for sequelize query based on the phone preference
 * in the preferences field of the Patient model.
 * @param value boolean
 * @returns {{where: {preferences: {phone: boolean}}}}
 */
export default function queryPhoneCommunicationPreference(value) {
  return { where: { preferences: { phone: value } } };
}
