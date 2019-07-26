
import PropTypes from 'prop-types';
import React from 'react';
import TimeSlotColumn from './TimeSlotColumn';
import ShowAppointment from './ShowAppointment';
import ShowMark from './ShowMark';
import styles from '../styles.scss';
import {
  calculateAppointmentTop,
  intersectingAppointments,
  sortAppsByStartDate,
  buildAppointmentProps,
} from './helpers';

/**
 * Function to calculate the intersection of appointments,
 * build the props and set the correct component to render
 * @param {*} params
 */
const renderDisplayComponent = params => (app, index, array) => {
  const {
    timeSlotHeight,
    startHour,
    endHour,
    selectAppointment,
    selectedAppointment,
    minWidth,
    numOfColumns,
    columnIndex,
    scheduleView,
    unit,
  } = params;

  const intersectingApps = intersectingAppointments(array, app.startDate, app.endDate);

  const rowSort = intersectingApps.sort(sortAppsByStartDate);

  const appoitmentParams = {
    appointment: app,
    rowSort,
    startHour,
    timeSlotHeight,
    unit,
    columnIndex,
    numOfColumns,
    minWidth,
  };

  const appoitmentProps = app.mark ? {} : buildAppointmentProps(appoitmentParams);

  return app.mark ? (
    <ShowMark
      key={index}
      appointment={app}
      startHour={startHour}
      endHour={endHour}
      rowSort={rowSort}
      timeSlotHeight={timeSlotHeight}
      {...appoitmentProps}
    />
  ) : (
    <ShowAppointment
      key={index}
      selectAppointment={selectAppointment}
      selectedAppointment={selectedAppointment}
      scheduleView={scheduleView}
      appointment={app}
      {...appoitmentProps}
    />
  );
};

export default function TimeSlot(props) {
  const { timeSlots, timeSlotHeight, filteredApps, minWidth, startHour, unit, entityId } = props;

  const timeSlotContentStyle = {
    minWidth: `${minWidth}px`,
  };

  return (
    <div style={timeSlotContentStyle} className={styles.timeSlotColumn}>
      <TimeSlotColumn prefixKey={entityId} timeSlots={timeSlots} timeSlotHeight={timeSlotHeight} />

      {filteredApps &&
        filteredApps
          .sort(sortAppsByStartDate)
          .map(
            calculateAppointmentTop({
              startHour,
              timeSlotHeight,
              unit,
            }),
          )
          .map(renderDisplayComponent(props))}
    </div>
  );
}

TimeSlot.propTypes = {
  startHour: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  timeSlots: PropTypes.arrayOf(
    PropTypes.shape({
      position: PropTypes.number,
    }),
  ).isRequired,
  timeSlotHeight: PropTypes.shape({
    height: PropTypes.number,
  }).isRequired,
  filteredApps: PropTypes.arrayOf(PropTypes.object).isRequired,
  unit: PropTypes.number.isRequired,
  entityId: PropTypes.string.isRequired,
};
