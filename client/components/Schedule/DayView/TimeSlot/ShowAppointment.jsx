
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-popover';
import moment from 'moment';
import styles from './styles.scss';
import { Icon } from '../../../library';
import AppointmentPopover from './AppointmentPopover';
import withHoverable from '../../../../hocs/withHoverable';
import { hexToRgbA } from '../../../library/util/colorMap';

const getDuration = (startDate, endDate, customBufferTime) => {
  const end = moment(endDate);
  const duration = moment.duration(end.diff(startDate));
  return duration.asMinutes() - customBufferTime;
};

const setPopoverPlacement = (columnIndex, numOfColumns, minWidth) => {
  const containerElement = document.getElementById('scheduleContainer');

  if (containerElement) {
    const containerWidth = containerElement.clientWidth;
    const maxColumns = Math.floor(containerWidth / minWidth);

    if (maxColumns > numOfColumns && columnIndex === (numOfColumns - 1)) {
      return 'left';
    } else if (maxColumns < numOfColumns && columnIndex === (maxColumns - 1)) {
      return 'left';
    } else if (columnIndex === numOfColumns - 1) {
      return 'left';
    }
  }

  return 'right';
};

/**
 * Function to calculate the height and the minHeight to display the hours inline
 *
 * @param {number} duration
 * @param {number} timeSlotHeight
 *
 * @returns {number} HeightCalculated
 */
const calculateHeight = (duration, timeSlotHeight) => (duration / 60) * timeSlotHeight;

/**
 * Function to shorten the time string based on the minutes
 * Can also set the AM/PM indicator
 * @param {string | moment} date
 * @param {bool} addAtoFormat
 */
const shortenTime = (date, addAtoFormat = true) => {
  date = moment(date);
  const aFormat = addAtoFormat ? 'a' : '';

  return date.get('minutes') === 0 ?
        date.format(`h${aFormat}`) :
        date.format(`h:mm${aFormat}`);
};

/**
 * Function that builds the correct format to display the times.
 * Supress the AM/PM of the end and start times are the same.
 * @param {string | moment} startDate
 * @param {string | moment} endDate
 */
const buildHoursFormat = (startDate, endDate = null) => {
  startDate = moment(startDate);
  
  if (endDate) {
    endDate = moment(endDate);

    const afternoon = 12;
    const addAtoFormat =
    (startDate.get('hour') >= afternoon && endDate.get('hour') >= afternoon) ||
    (startDate.get('hour') < afternoon && endDate.get('hour') < afternoon);
    
    return `${shortenTime(startDate, !addAtoFormat)} - ${shortenTime(endDate)}`;
  }
  return shortenTime(startDate);
};

/**
 * Builds the final string to display.
 * @param {string | moment} startDate
 * @param {string | moment} endDate
 * @param {bool} inline
 */
const buildHoursString = (startDate, endDate, inline = false) => {
  const timeString = inline ?
      buildHoursFormat(startDate) :
      buildHoursFormat(startDate, endDate);

  return timeString;
};

/**
 * Hours presenter component
 *
 * @param {stylesheet} styles
 * @param {date} startDate
 * @param {date} endDate
 * @param {bool} inline - add a comma if true
 */
const AppointmentHours = ({
  style,
  startDate,
  endDate,
  inline = false,
}) => (
  <span className={style.nameContainer_hours}>
    {inline && ','} {buildHoursString(startDate, endDate, inline)}
  </span>
  );


AppointmentHours.propTypes = {
  style: PropTypes.shape({ nameContainer_hours: PropTypes.string }),
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  inline: PropTypes.bool,
};
/**
 * ShowAppointment represents each block of appointment on the calendar view
 * it is used on both PractitionersSlot and ChairSlot components
 * and is rendered by the TimeSlot component.
 * Also responsible for the toggling the PopOver component.
 *
 */
class ShowAppointment extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
      /**
       * this two properties hold the nameContainer actual width
       * and the minimun offSetWidth to display the AppointmentHours component inline
       */
      nameContainerOffsetWidth: 100,
      nameContainerOffset: 100,
    };
    
    this.togglePopover = this.togglePopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
    this.editAppointment = this.editAppointment.bind(this);
  }

  componentDidMount() {
    // This prevents setState to be called indefinitely
    if (this.state.nameContainerOffsetWidth !== this.nameContainer.offsetWidth) {
      /* eslint-disable react/no-did-mount-set-state */
      this.setState({ nameContainerOffsetWidth: this.nameContainer.offsetWidth });
    }
  }

  togglePopover() {
    this.setState({
      isOpened: !this.state.isOpened,
    });
  }

  closePopover() {
    this.setState({
      isOpened: false,
    });
  }

  editAppointment() {
    this.closePopover();
    this.props.selectAppointment(this.props.appointment);
  }

  render() {
    const {
      appointment,
      selectedAppointment,
      startHour,
      rowSort,
      isHovered,
      timeSlotHeight,
      numOfColumns,
      columnIndex,
      minWidth,
      scheduleView,
      unit,
    } = this.props;

    const {
      isOpened,
      nameContainerOffsetWidth,
      nameContainerOffset,
    } = this.state;

    const {
      startDate,
      endDate,
      customBufferTime,
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

    const bgColor = practitionerData.color;
    const patient = patientData.toJS();
    const age = moment().diff(patient.birthDate, 'years') || '';
    const lastName = patient.lastName;

    // Calculating the top position and height of the appointment.
    const durationTime = getDuration(startDate, endDate, customBufferTime);
    const startDateHours = moment(startDate).hours();
    const startDateMinutes = moment(startDate).minutes();

    const topCalc = (((startDateHours - startHour) + (startDateMinutes / 60)) * timeSlotHeight.height);
  
    const heightCalc = calculateHeight((durationTime > unit ? durationTime : unit), timeSlotHeight.height);
        
    const splitRow = rowSort.length > 1 ? (100 * (appPosition / (rowSort.length))) : 0;
    const top = `${(topCalc + 0.05)}px`;
    const left = `${splitRow + 0.07}%`;

    const widthPadding = 0.6;
    const width = `${(100 * ((100 / rowSort.length) / 100)) - widthPadding}%`;
    
    const height = `${heightCalc - 0.1}px`;
    
    const backgroundColor = bgColor;
    const zIndex = isHovered ? 5 : appPosition;

    // set the minimum height to display the hours below the name. Set to 30 min
    const displayDurationHeight = calculateHeight(30, timeSlotHeight.height);

    const containerStyle = {
      top,
      width,
      left,
    };

    // main app style
    const appStyle = {
      height,
      backgroundColor,
      border: 0,
      zIndex,
      boxShadow: this.state.isOpened ? `0px 2px 6px 0px ${hexToRgbA(bgColor, 0.5)}` : 'none',
    };

    const placement = numOfColumns === 1 ? 'below' : setPopoverPlacement(columnIndex, numOfColumns, minWidth);

    // function to check if there is enought room to display the AppointmentHours inline
    const canInlineAppointment = () => (
      displayDurationHeight > heightCalc &&
      nameContainerOffsetWidth >= nameContainerOffset
    );

    return (
      <Popover
        isOpen={isOpened && !selectedAppointment}
        body={[(
          <AppointmentPopover
            appointment={appointment}
            patient={patientData}
            age={age}
            closePopover={this.closePopover}
            editAppointment={this.editAppointment}
            scheduleView={scheduleView}
          />
        )]}
        preferPlace={placement}
        tipSize={0.01}
        onOuterAction={this.closePopover}
      >
        <div
          onClick={this.togglePopover}
          role="button"
          onDoubleClick={this.editAppointment}
          className={styles.appointmentContainer}
          style={containerStyle}
        >
          <div
            className={styles.showAppointment}
            style={appStyle}
            data-test-id={`timeSlot${patient.firstName}${patient.lastName}`}
          >
            {isPatientConfirmed || isReminderSent ? (
              <div className={styles.icon}>
                {(isPatientConfirmed ? <Icon size={1} icon="check-circle" type="solid" /> : <Icon size={1} icon="clock-o" />)}
              </div>) : null}

            <div className={styles.nameContainer} ref={(div) => { this.nameContainer = div; }}>
              <div className={styles.nameContainer_name}>
                {`${patient.firstName} ${lastName}`}
              </div>
              
              {canInlineAppointment() &&
                <AppointmentHours
                  style={styles}
                  startDate={startDate}
                  endDate={endDate}
                  inline
                /> }
            </div>

            {!canInlineAppointment() &&
              <AppointmentHours
                style={styles}
                startDate={startDate}
                endDate={endDate}
              /> }
          </div>
        </div>
      </Popover>
    );
  }
}

ShowAppointment.propTypes = {
  appointment: PropTypes.object.isRequired,
  bgColor: PropTypes.string,
  patient: PropTypes.object,
  selectAppointment: PropTypes.func.isRequired,
  selectedAppointment: PropTypes.object,
  startHour: PropTypes.number,
  rowSort: PropTypes.arrayOf(Array),
  isHovered: PropTypes.bool,
  timeSlotHeight: PropTypes.object,
  numOfColumns: PropTypes.number,
  columnIndex: PropTypes.number,
  minWidth: PropTypes.number,
  scheduleView: PropTypes.string,
  unit: PropTypes.number,
};

export default withHoverable(ShowAppointment);
