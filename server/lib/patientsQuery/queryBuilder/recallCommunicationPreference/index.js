
/**
 * builds a query object for sequelize query based on the recalls preference
 * in the preferences field of the Patient model.
 * @param value boolean
 * @returns {{where: {preferences: {recalls: boolean}}}}
 */
export default function queryRecallCommunicationPreference(value) {
  return { where: { preferences: { recalls: value } } };
}
