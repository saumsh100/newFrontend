
import { connect } from 'react-redux';
import { withState } from 'recompose';
import PropTypes from 'prop-types';
import {
  getTodaysDate,
  getUTCDate,
  getUTCDateWithFormat,
  parseDateWithFormat,
} from '../../../library';

function mapStateToProps({ form, auth }, { formName }) {
  // form data is populated when component renders
  if (!form[formName]) {
    return {
      values: {},
      timezone: auth.get('timezone'),
    };
  }

  return {
    values: form[formName].values,
    timezone: auth.get('timezone'),
  };
}

const enhance = withState('showOption', 'setOption', false);

export const enhanceFormHOC = component => enhance(connect(mapStateToProps, null)(component));

export const TimeOffDefaultProps = {
  formName: null,
  timeOff: null,
  values: null,
  showOption: null,
  setOption: null,
};

export const TimeOffFormPropTypes = {
  timeOff: PropTypes.instanceOf(Map),
  formName: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  values: PropTypes.shape({
    allDay: PropTypes.bool,
  }),
  showOption: PropTypes.func,
  setOption: PropTypes.func,
};

export const defaultTimeOptions = {
  year: 1970,
  month: 0,
  date: 31,
  minutes: 0,
};

export const setDate = (date, timezone, resetTime = false) => {
  const mergeTime = parseDateWithFormat(date, ['YYYY-MM-DDThh:mm:ssZ', 'L'], timezone);
  if (!mergeTime.isValid()) {
    const newDate = getTodaysDate(timezone);
    if (resetTime) {
      newDate.set({
        hour: 0,
        minute: 0,
      });
    }
    return newDate.format('L');
  }

  return mergeTime.format('L');
};

export const setTime = (time, timezone) => {
  const completeTime = getUTCDateWithFormat(time, 'YYYY-MM-DDThh:mm:ssZ', timezone).set(
    defaultTimeOptions,
  );

  if (!completeTime.isValid()) {
    return getUTCDate(time, timezone)
      .set({
        ...defaultTimeOptions,
        hour: 0,
      })
      .format();
  }

  return completeTime.format();
};

export const checkDates = ({ startDate, endDate }) => {
  const errors = {};
  const sDate = new Date(startDate);
  const eDate = new Date(endDate);

  if (sDate > eDate) {
    errors.startDate = 'Start date has to be less than end date.';
  } else if (eDate < sDate) {
    errors.endDate = 'End date has to be greater than start date.';
  }

  return errors;
};
