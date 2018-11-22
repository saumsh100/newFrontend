
/**
 * builds a query object for sequelize query based on firstName field of the Patient model.
 * @param value
 * @returns {{where: {firstName: *}}}
 */
export default function queryFirstName(value) {
  return { where: { firstName: value } };
}
