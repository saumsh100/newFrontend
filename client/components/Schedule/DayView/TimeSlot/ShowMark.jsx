
import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import Appointment from '../../../../entities/models/Appointments';
import styles from './styles.scss';

export default function ShowMark(props) {
  const { appointment, appStyle, containerStyle } = props;

  const { note, description } = appointment;

  return (
    <div className={styles.appointmentContainer} style={containerStyle}>
      <div className={classnames(styles.showAppointment, styles.showMark)} style={appStyle}>
        <div className={styles.mark}>
          <span className={styles.mark_note} style={appStyle}>
            {description || note || ''}
          </span>
        </div>
      </div>
    </div>
  );
}

ShowMark.propTypes = {
  appointment: PropTypes.instanceOf(Appointment).isRequired,
  timeSlotHeight: PropTypes.shape({
    height: PropTypes.number,
  }),
  containerStyle: PropTypes.shape({
    top: PropTypes.string,
    width: PropTypes.string,
    left: PropTypes.string,
  }),
  appStyle: PropTypes.shape({
    height: PropTypes.string,
    backgroundColor: PropTypes.string,
    zIndex: PropTypes.number,
  }),
};

ShowMark.defaultProps = {
  containerStyle: {},
  appStyle: {},
  timeSlotHeight: {},
};
