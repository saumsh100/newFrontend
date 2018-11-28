
/**
 * builds a query object for sequelize query based on city field of the Patient model.
 * @param value
 * @returns {{where: {address: {city: {$iLike: string}}}}}
 */
export default function queryCity(value) {
  return { where: { address: { city: { $iLike: `%${value}%` } } } };
}
