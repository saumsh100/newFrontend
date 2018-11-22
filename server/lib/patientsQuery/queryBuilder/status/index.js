
/**
 * builds a query object for sequelize query based on status field of the Patient model.
 * @param value
 * @returns {{where: {status: *}}}
 */
export default function queryStatus(value) {
  return { where: { status: value } };
}
