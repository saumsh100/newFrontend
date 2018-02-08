
import moment from 'moment';

export const validDateValue = (date) => {
  const dateValue = moment(date);
  return dateValue.isValid() ? dateValue.format('MMM Do, YYYY') : '-';
}
