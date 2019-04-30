
import moment from 'moment-timezone';

const today = moment()
  .startOf('day')
  .add(12, 'hours');

export default [
  {
    typeName: 'Yesterday',
    toDate: today.toDate(),
    fromDate: today.subtract(1, 'day').toDate(),
  },
  {
    typeName: 'This Week',
    fromDate: today.startOf('week').toDate(),
    toDate: today.endOf('week').toDate(),
  },
  {
    typeName: 'This Month',
    fromDate: today.startOf('month').toDate(),
    toDate: today.endOf('month').toDate(),
  },
  {
    typeName: 'This Year',
    fromDate: today.startOf('year').toDate(),
    toDate: today.endOf('year').toDate(),
  },
];
