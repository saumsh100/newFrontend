
import { setDateToTimezone } from '../../../../util/time';

/**
 * builds a query object for sequelize query based on age/birthDate field of the Patient model.
 * @param value string[]
 * @returns {{where: {birthDate: {$between: string[]}}}}
 */
export default function queryAge([endYear, startYear]) {
  const now = setDateToTimezone()
    .hours(0)
    .minutes(0)
    .seconds(0)
    .milliseconds(0);

  const endDate = now.subtract(endYear, 'years').toISOString();
  const startDate = now.subtract(startYear, 'years').toISOString();

  return { where: { birthDate: { $between: [startDate, endDate] } } };
}
