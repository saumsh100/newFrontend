
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import styles from './styles.scss';

export default function AppointmentEvent(props) {
  const { data, bodyStyle } = props;

  return (
    <div className={bodyStyle}>
      <div className={styles.body_header}>
        Appointment on {moment(data.startDate).format('MMMM Do, YYYY h:mma')}
      </div>
      <div className={styles.body_subHeaderItalic}>{data.note || ''}</div>
    </div>
  );
}

AppointmentEvent.propTypes = {
  data: PropTypes.shape({
    startDate: PropTypes.string,
    note: PropTypes.string,
  }).isRequired,
  bodyStyle: PropTypes.string,
};

AppointmentEvent.defaultProps = {
  bodyStyle: null,
};
