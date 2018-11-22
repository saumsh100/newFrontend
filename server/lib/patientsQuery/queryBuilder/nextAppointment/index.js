
/**
 * builds a query object for sequelize query based on nextApptDate field of the Patient model.
 * @param value string[]
 * @returns {{where: {nextApptDate: {$between: *[]}}}}
 */
export default function queryNextAppointment([endDate, startDate]) {
  return { where: { nextApptDate: { $between: [startDate, endDate] } } };
}
