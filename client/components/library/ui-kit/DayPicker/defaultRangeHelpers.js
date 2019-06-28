
import moment from 'moment-timezone';

const today = moment()
  .startOf('day')
  .add(12, 'hours');

export default [
  {
    label: 'Yesterday',
    end: today.clone().toDate(),
    start: today
      .clone()
      .subtract(1, 'day')
      .toDate(),
  },
  {
    label: 'This Week',
    start: today
      .clone()
      .startOf('week')
      .toDate(),
    end: today
      .clone()
      .endOf('week')
      .toDate(),
  },
  {
    label: 'This Month',
    start: today
      .clone()
      .startOf('month')
      .toDate(),
    end: today
      .clone()
      .endOf('month')
      .toDate(),
  },
  {
    label: 'This Year',
    start: today
      .clone()
      .startOf('year')
      .toDate(),
    end: today
      .clone()
      .endOf('year')
      .toDate(),
  },
];
