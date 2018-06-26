
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-popover';
import styles from '../styles.scss';
import { Icon, Button } from '../../../../library';
import AppointmentPopover from '../AppointmentPopover';
import AppointmentHours from '../AppointmentHours';
import withHoverable from '../../../../../hocs/withHoverable';

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
    if (
      this.state.nameContainerOffsetWidth !== this.nameContainer.offsetWidth
    ) {
      this.setState({
        nameContainerOffsetWidth: this.nameContainer.offsetWidth,
      });
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
      scheduleView,
      displayDurationHeight,
      heightCalc,
      placement,
      containerStyle,
      appStyle,
      patient,
      isPatientConfirmed,
      isReminderSent,
      startDate,
      endDate,
    } = this.props;

    const {
      isOpened,
      nameContainerOffsetWidth,
      nameContainerOffset,
    } = this.state;

    appStyle.boxShadow = isOpened
      ? '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.2)'
      : 'none';

    // functions to check if there is enough room to display the AppointmentHours inline
    const canShowAppointmentBelow = () => heightCalc >= displayDurationHeight;

    const canInlineAppointment = () =>
      !canShowAppointmentBelow() &&
      nameContainerOffsetWidth >= nameContainerOffset;

    return (
      <Popover
        isOpen={isOpened && !selectedAppointment}
        body={[
          <AppointmentPopover
            appointment={appointment}
            patient={patient}
            closePopover={this.closePopover}
            editAppointment={this.editAppointment}
            scheduleView={scheduleView}
          />,
        ]}
        preferPlace={placement}
        tipSize={12}
        onOuterAction={this.closePopover}
        className={styles.appPopover}
      >
        <Button
          onClick={this.togglePopover}
          onDoubleClick={this.editAppointment}
          className={styles.appointmentContainer}
          style={containerStyle}
          data-test-id={`appointment_${patient.get('firstName')}${patient.get('lastName')}`}
        >
          <div className={styles.showAppointment} style={appStyle}>
            {isPatientConfirmed || isReminderSent ? (
              <div className={styles.icon}>
                {isPatientConfirmed ? (
                  <Icon size={1} icon="check-circle" type="solid" />
                ) : (
                  <Icon size={1} icon="clock-o" />
                )}
              </div>
            ) : null}

            <div
              className={styles.nameContainer}
              ref={(div) => {
                this.nameContainer = div;
              }}
            >
              <div className={styles.nameContainer_name}>
                {`${patient.get('firstName')} ${patient.get('lastName')}`}
              </div>

              {canInlineAppointment() && (
                <AppointmentHours
                  startDate={startDate}
                  endDate={endDate}
                  inline
                />
              )}
            </div>

            {canShowAppointmentBelow() && (
              <AppointmentHours startDate={startDate} endDate={endDate} />
            )}
          </div>
        </Button>
      </Popover>
    );
  }
}

ShowAppointment.propTypes = {
  appointment: PropTypes.shape({ id: PropTypes.string }).isRequired,
  selectAppointment: PropTypes.func.isRequired,
  selectedAppointment: PropTypes.shape({ id: PropTypes.string }),
  scheduleView: PropTypes.string.isRequired,
  displayDurationHeight: PropTypes.number.isRequired,
  heightCalc: PropTypes.number.isRequired,
  placement: PropTypes.string,
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
  patient: PropTypes.shape({ id: PropTypes.string }).isRequired,
  isPatientConfirmed: PropTypes.bool,
  isReminderSent: PropTypes.bool,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
};

ShowAppointment.defaultProps = {
  selectedAppointment: {},
  placement: 'right',
  containerStyle: {},
  appStyle: {},
  isPatientConfirmed: false,
  isReminderSent: false,
  startDate: '',
  endDate: '',
};

export default withHoverable(ShowAppointment);
