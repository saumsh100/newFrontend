
import { connect } from 'react-redux';
import { withState } from 'recompose';
import PropTypes from 'prop-types';
import moment from 'moment-timezone';

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
  timeOff: PropTypes.shape(PropTypes.any),
  formName: PropTypes.string,
  handleSubmit: PropTypes.func.isRequired,
  timezone: PropTypes.string.isRequired,
  values: PropTypes.objectOf(PropTypes.any),
  showOption: PropTypes.func,
  setOption: PropTypes.func,
};

export const generateTimeOptions = (timezone) => {
  const timeOptions = [];
  const totalHours = 24;
  const increment = 60;
  const increments = 60 / increment;

  let i;
  for (i = 0; i < totalHours; i += 1) {
    let j;
    for (j = 0; j < increments; j += 1) {
      const time = moment.tz(`1970-1-31 ${i}:${j * increment}`, 'YYYY-M-D H:mm', timezone);
      const value = time.format();
      const label = time.format('LT');
      timeOptions.push({
        value,
        label,
      });
    }
  }

  return timeOptions;
};
