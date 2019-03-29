
/**
 * builds a query object for sequelize query based on the reminders preference
 * in the preferences field of the Patient model.
 * @param value boolean
 * @returns {{where: {preferences: {reminders: boolean}}}}
 */
export default function queryReminderCommunicationPreference(value) {
  return { where: { preferences: { reminders: value } } };
}
