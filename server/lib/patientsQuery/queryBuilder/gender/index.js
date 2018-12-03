
/**
 * builds a query object for sequelize query based on gender field of the Patient model.
 * @param value
 * @returns {{where: {gender: {$iLike: *}}}}
 */

export default function queryGender(value) {
  return { where: { gender: { $iLike: `${value}%` } } };
}