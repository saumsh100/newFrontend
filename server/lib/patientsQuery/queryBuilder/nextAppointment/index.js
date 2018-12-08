
/**
 * builds a query object for sequelize query based on nextApptDate field of the Patient model.
 * @param dates string[]
 * @returns {{where: {nextApptDate: {$between: *[]}}}}
 */
export default function queryNextAppointment(dates) {
  return { where: { nextApptDate: { $between: dates } } };
}
