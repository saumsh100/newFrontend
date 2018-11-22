
/**
 * builds a query object for sequelize query based on lastApptDate field of the Patient model.
 * @param value string[]
 * @returns {{where: {lastApptDate: {$between: *[]}}}}
 */
export default function queryLastAppointment([endDate, startDate]) {
  return { where: { lastApptDate: { $between: [startDate, endDate] } } };
}
