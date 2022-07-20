import { differenceInMinutes } from 'date-fns/esm';
import {
  APPOITMENT_POSITION_LEFT_PADDING,
  APPOITMENT_WIDTH_LEFT_PADDING,
  APPOITMENT_POPOVER_DEFAULT_PLACEMENT,
} from '../../../../constants/schedule';
import { getUTCDate, getDateDuration } from '../../../library';

/**
 * Returns an array of appointments
 * that intersect in a given start and end date
 * @param {*} appointments
 * @param {*} startDate
 * @param {*} endDate
 * @param {*} timezone
 */
export const intersectingAppointments = (appointments, startDate, endDate, timezone) => {
  const sDate = getUTCDate(startDate, timezone);
  const eDate = getUTCDate(endDate, timezone);

  return appointments.filter((app) => {
    const appStartDate = getUTCDate(app.startDate, timezone);
    const appEndDate = getUTCDate(app.endDate, timezone);

    const dateIntersectsApp =
      sDate.isBetween(appStartDate, appEndDate, null, '[)') ||
      eDate.isBetween(appStartDate, appEndDate, null, '(]');

    const appIntersectsDates =
      appStartDate.isBetween(sDate, eDate, null, '()') ||
      appEndDate.isBetween(sDate, eDate, null, '()');

    return dateIntersectsApp || appIntersectsDates;
  });
};

/**
 * Sorts the array of appointments by its startDate
 * @param {*} a
 * @param {*} b
 */
export const sortAppsByStartDate = (a, b) => (a.startDate > b.startDate ? 1 : -1);

/**
 * Function to calculate the height and the minHeight to display the hours inline
 *
 * @param {number} duration
 * @param {number} timeSlotHeight
 *
 * @returns {number} HeightCalculated
 */
export const calculateHeight = (duration, timeSlotHeight) => (duration / 60) * timeSlotHeight;

export const getDuration = (startDate, endDate, customBufferTime, timezone = null) => {
  const end = getUTCDate(endDate, timezone);
  const duration = getDateDuration(end.diff(startDate));
  return duration.asMinutes() - customBufferTime;
};

/**
 * Sets the placement of the popover component
 * based on column index,number of columns and width of it
 * @param {*} columnIndex
 * @param {*} numOfColumns
 * @param {*} minWidth
 */
export const setPopoverPlacement = (columnIndex, numOfColumns, minWidth) => {
  const containerElement = document.getElementById('scheduleContainer');
  if (!containerElement) return 'right';

  const containerWidth = containerElement.clientWidth;
  const maxColumns = Math.floor(containerWidth / minWidth);

  if (maxColumns > numOfColumns && columnIndex === numOfColumns - 1) {
    return 'left';
  }
  if (maxColumns < numOfColumns && columnIndex === maxColumns - 1) {
    return 'left';
  }
  if (columnIndex === numOfColumns - 1) {
    return 'left';
  }
  return 'right';
};

/**
 * Calculate the appointment top positioning and height
 * @param {*} params
 * @returns {appoitment} a new appointment with height and top positioning properties
 */
export const calculateAppointmentTop = (params) => (appointment) => {
  const { startHour, timeSlotHeight, unit, timezone } = params;

  const { startDate, endDate, customBufferTime } = appointment;
  const durationTime = getDuration(startDate, endDate, customBufferTime || 0, timezone);
  const startDateHours = getUTCDate(startDate, timezone).hours();
  const startDateMinutes = getUTCDate(startDate, timezone).minutes();
  const positionTopPadding = 0.05;

  const startDateMinutesDived = startDateMinutes / 60;

  const calcResult = (startDateHours - startHour + startDateMinutesDived) * timeSlotHeight.height;
  appointment.topCalc = calcResult;

  appointment.heightCalc = calculateHeight(
    durationTime > unit ? durationTime : unit,
    timeSlotHeight.height,
  );
  appointment.top = `${appointment.topCalc + positionTopPadding}px`;
  const timeBoxInMinutes = differenceInMinutes(new Date(endDate), new Date(startDate));
  appointment.height = timeBoxInMinutes <= 30 ? 27 : `${appointment.heightCalc - 1}px`;

  // set the minimum height to display the hours below the name. Set to 30 min
  const MIN_HEIGHT = 27;
  appointment.displayDurationHeight = calculateHeight(MIN_HEIGHT, timeSlotHeight.height);

  return appointment;
};

/**
 * Function to build the ShowAppointment Props,
 * it receives the same props as the TimeSlot component
 * @param {*} params
 */
export const buildAppointmentProps = (params) => {
  const {
    appointment,
    rowSort,
    startHour,
    timeSlotHeight,
    unit,
    columnIndex,
    numOfColumns,
    minWidth,
    backgroundColor,
    iconColor,
    fontColor,
  } = params;

  const {
    startDate,
    endDate,
    heightCalc,
    height,
    displayDurationHeight,
    top,
    patientData,
    isPatientConfirmed,
    isReminderSent,
    practitionerData,
  } = appointment;

  let appPosition = 0;
  rowSort.forEach((app, index) => {
    if (appointment.id === app.id) {
      appPosition = index;
    }
  });

  // Calculating the top position and height of the appointment.
  const splitRow = rowSort.length > 1 ? (100 * appPosition) / rowSort.length : 0;

  const multiAppLineLeft = `calc(${splitRow}% - ${
    appPosition + 1 === rowSort.length
      ? APPOITMENT_POSITION_LEFT_PADDING
      : APPOITMENT_WIDTH_LEFT_PADDING
  }px)`;

  const left = appPosition > 0 ? multiAppLineLeft : `${splitRow}%`;

  const multiAppLineWidth =
    appPosition > 0
      ? `calc(${100 / rowSort.length}%)`
      : `calc(${100 / rowSort.length}% - ${APPOITMENT_WIDTH_LEFT_PADDING}px)`;

  const width =
    rowSort.length > 1
      ? multiAppLineWidth
      : `calc(${100}% - ${APPOITMENT_POSITION_LEFT_PADDING}px)`;

  const containerStyle = {
    top,
    width,
    left,
  };
  // main app style
  const appStyle = {
    height,
    backgroundColor: backgroundColor || practitionerData.color,
    color: fontColor || practitionerData.fontColor,
    iconColor: iconColor || practitionerData.iconColor,
    zIndex: appPosition,
  };

  const placement =
    numOfColumns === 1
      ? APPOITMENT_POPOVER_DEFAULT_PLACEMENT
      : setPopoverPlacement(columnIndex, numOfColumns, minWidth);

  return {
    rowSort,
    startHour,
    timeSlotHeight,
    unit,
    columnIndex,
    numOfColumns,
    minWidth,
    startDate,
    endDate,
    isPatientConfirmed,
    isReminderSent,
    containerStyle,
    heightCalc,
    appStyle,
    placement,
    displayDurationHeight,
    patient: patientData,
  };
};
