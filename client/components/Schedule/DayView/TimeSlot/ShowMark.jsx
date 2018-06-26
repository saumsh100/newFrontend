
import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import Appointment from '../../../../entities/models/Appointments';
import styles from './styles.scss';

import { hexToRgbA } from '../../../library/util/colorMap';
import { getDuration } from '../../../library/util/TimeOptions';

export default function ShowMark(props) {
  const {
    appointment, startHour, rowSort, timeSlotHeight,
  } = props;

  const {
    startDate, endDate, customBufferTime, note,
  } = appointment;

  let appPosition = 0;
  rowSort.forEach((app, index) => {
    if (appointment.id === app.id) {
      appPosition = index;
    }
  });

  // Calculating the top position and height of the appointment.
  const durationTime = getDuration(startDate, endDate, customBufferTime);
  const startDateHours = moment(startDate).hours();
  const startDateMinutes = moment(startDate).minutes();

  const startDateMinutesDived = startDateMinutes / 60;

  const topCalc = (startDateHours - startHour + startDateMinutesDived) * timeSlotHeight.height;

  const heightCalc = durationTime / 60 * timeSlotHeight.height;

  const splitRow = rowSort.length > 1 ? 100 * (appPosition / rowSort.length) : 0;
  const top = `${topCalc + 0.05}px`;
  const left = `${splitRow + 0.07}%`;

  const widthPadding = 0.6;
  const widthCalc = 100 * (100 / rowSort.length / 100);
  const width = `${widthCalc - widthPadding}%`;
  const height = `${heightCalc - 0.1}px`;

  // main app style
  const containerStyle = {
    height,
    top,
    width,
    left,
  };

  const appStyle = {
    top,
    height,
    backgroundColor: hexToRgbA('#b4b4b5', 1),
    border: `0.5px solid ${appPosition === 0 ? hexToRgbA('#b4b4b5', 1) : '#FFFFFF'}`,
    zIndex: appPosition,
  };

  const noteStyle = {
    width,
    maxHeight: height,
  };

  return (
    <div className={styles.appointmentContainer} style={containerStyle}>
      <div className={styles.showAppointment_mark} style={appStyle}>
        <div className={styles.mark}>
          <span className={styles.mark_note} style={noteStyle}>
            {note || ''}
          </span>
        </div>
      </div>
    </div>
  );
}

ShowMark.propTypes = {
  appointment: PropTypes.instanceOf(Appointment).isRequired,
  startHour: PropTypes.number.isRequired,
  rowSort: PropTypes.arrayOf(PropTypes.any).isRequired,
  timeSlotHeight: PropTypes.shape({
    height: PropTypes.number,
  }),
};

ShowMark.defaultProps = {
  timeSlotHeight: {},
};
