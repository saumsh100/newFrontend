
/**
 * builds a query object for sequelize query based on firstApptDate field of the Patient model.
 * @param value string[]
 * @returns {{where: {firstApptDate: {$between: *[]}}}}
 */
export default function queryFirstAppointment([endDate, startDate]) {
  return { where: { firstApptDate: { $between: [startDate, endDate] } } };
}
