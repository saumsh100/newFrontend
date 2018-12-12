
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { dateFormatter } from '@carecru/isomorphic';

function TimezoneFormatter({ timezone, render, date, format }) {
  return render({
    formattedDate: dateFormatter(date, timezone, format),
    timezone,
    format,
  });
}

function mapStateToProps({ auth, availabilities }) {
  const widgetAccount = availabilities.get('account');
  return { timezone: widgetAccount ? widgetAccount.get('timezone') : auth.get('timezone') };
}

TimezoneFormatter.propTypes = {
  timezone: PropTypes.string.isRequired,
  render: PropTypes.func.isRequired,
  format: PropTypes.string,
};

TimezoneFormatter.defaultProps = { format: 'LT' };

export default connect(
  mapStateToProps,
  null,
)(TimezoneFormatter);
