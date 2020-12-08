
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
import { hexToRgbA } from '../../../library/util/colorMap';

/**
 * Function to calculate the intersection of appointments,
 * build the props and set the correct component to render
 * @param {*} params
 */
const renderDisplayComponent = params => (item, index, array) => {
  const {
    timeSlotHeight,
    startHour,
    selectAppointment,
    selectedAppointment,
    minWidth,
    numOfColumns,
    columnIndex,
    scheduleView,
    unit,
  } = params;

  const intersectingApps = intersectingAppointments(array, item.startDate, item.endDate);
  const rowSort = intersectingApps.sort(sortAppsByStartDate);
  const defaultApptParams = {
    appointment: item,
    rowSort,
    startHour,
    timeSlotHeight,
    unit,
    columnIndex,
    numOfColumns,
    minWidth,
  };

  return item.mark || item.event ? (
    <ShowMark
      key={index}
      appointment={item}
      timeSlotHeight={timeSlotHeight}
      {...buildAppointmentProps({
        ...defaultApptParams,
        backgroundColor: hexToRgbA('#d8d8d8', 1),
      })}
    />
  ) : (
    <ShowAppointment
      key={index}
      appointment={item}
      selectAppointment={selectAppointment}
      selectedAppointment={selectedAppointment}
      scheduleView={scheduleView}
      {...buildAppointmentProps(defaultApptParams)}
    />
  );
};

export default function TimeSlot(props) {
  const { timeSlots, timeSlotHeight, items, minWidth, startHour, unit, entityId } = props;

  const timeSlotContentStyle = {
    minWidth: `${minWidth}px`,
  };

  return (
    <div style={timeSlotContentStyle} className={styles.timeSlotColumn}>
      <TimeSlotColumn prefixKey={entityId} timeSlots={timeSlots} timeSlotHeight={timeSlotHeight} />

      {items &&
        items
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
  items: PropTypes.arrayOf(PropTypes.object).isRequired,
  unit: PropTypes.number.isRequired,
  entityId: PropTypes.string.isRequired,
};
