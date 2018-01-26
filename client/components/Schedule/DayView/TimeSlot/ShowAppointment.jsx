
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

    return 'right';
  }
};

class ShowAppointment extends Component{
  constructor(props) {
    super(props);
    this.state = {
      isOpened: false,
    };

    this.togglePopover = this.togglePopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
    this.editAppointment = this.editAppointment.bind(this);
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
    } = this.props;

    const {
      startDate,
      endDate,
      customBufferTime,
      patientData,
      isPatientConfirmed,
      isReminderSent,
      note,
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
    const heightCalc = ((durationTime) / 60) * timeSlotHeight.height;

    const splitRow = rowSort.length > 1 ? (100 * (appPosition / (rowSort.length))) : 0;
    const top = `${(topCalc + 0.05)}px`;
    const left = `${splitRow + 0.07}%`;

    const widthPadding = 0.6;
    const width = `${(100 * ((100 / rowSort.length) / 100)) - widthPadding}%`;
    const height = `${heightCalc - 0.1}px`;

    const backgroundColor = bgColor;
    const zIndex = isHovered ? 5 : appPosition;

    const containerStyle = {
      height,
      top,
      width,
      left,
    };

    // main app style
    const appStyle = {
      height,
      backgroundColor,
      border: `0.5px solid ${appPosition === 0 ? bgColor : '#FFFFFF'}`,
      zIndex,
      boxShadow: this.state.isOpened ? `0px 3px 5px 0px ${hexToRgbA(bgColor, 0.5)}` : 'none',
    };

    const placement = numOfColumns === 1 ? 'below' : setPopoverPlacement(columnIndex, numOfColumns, minWidth);

    return (
      <Popover
        isOpen={this.state.isOpened && !selectedAppointment}
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
          onDoubleClick={this.editAppointment}
          className={styles.appointmentContainer}
          style={containerStyle}
        >
          <div
            className={styles.showAppointment}
            style={appStyle}
            data-test-id={`timeSlot${patient.firstName}${patient.lastName}`}
          >
            {isPatientConfirmed || isReminderSent ? (<div className={styles.icon}>
              <div className={styles.icon_item}>{(isPatientConfirmed && <Icon size={1} icon="check-circle" />)}</div>
              <div className={styles.icon_item}> {(isReminderSent && <Icon size={1} icon="clock-o" />)} </div>
            </div>) : null}

            <div className={styles.nameAge}>
              <div className={styles.nameAge_name} >
                <span className={styles.paddingText}>{patient.firstName}</span>
                <span className={styles.paddingText}>{lastName}</span>
              </div>
            </div>

            <div className={styles.duration}>
              <span className={styles.duration_text}>
                {moment(startDate).format('h:mm a')} - {moment(endDate).format('h:mm a')}
              </span>
            </div>
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
};

export default withHoverable(ShowAppointment);
