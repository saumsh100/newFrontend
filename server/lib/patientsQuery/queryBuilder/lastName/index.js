
/**
 * builds a query object for sequelize query based on lastName field of the Patient model.
 * @param value
 * @returns {{where: {lastName: *}}}
 */
export default function queryLastName(value) {
  return { where: { lastName: value } };
}
