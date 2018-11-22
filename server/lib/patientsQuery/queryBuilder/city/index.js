
/**
 * builds a query object for sequelize query based on city field of the Patient model.
 * @param value
 * @returns {{where: {address: {city: {$ilike: string}}}}}
 */
export default function queryCity(value) {
  return { where: { address: { city: { $ilike: `%${value}%` } } } };
}
