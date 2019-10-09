
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-popover';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { getOrCreateChatForPatient } from '../../../../../thunks/chat';
import { Icon, Button } from '../../../../library';
import AppointmentInfo from '../../../../library/AppointmentPopover/AppointmentInfo';
import {
  appointmentShape,
  patientShape,
  practitionerShape,
  chairShape,
} from '../../../../library/PropTypeShapes';
import AppointmentHours from '../AppointmentHours';
import styles from '../styles.scss';

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
    this.editPatient = this.editPatient.bind(this);
  }

  componentDidMount() {
    // This prevents setState to be called indefinitely
    if (this.state.nameContainerOffsetWidth !== this.nameContainer.offsetWidth) {
      this.setState({ nameContainerOffsetWidth: this.nameContainer.offsetWidth });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.patientChat === null && prevProps.patientChat !== this.props.patientChat) {
      this.props.push(`/chat/${this.props.patientChat}`);
    }
  }

  togglePopover() {
    this.setState({ isOpened: !this.state.isOpened });
  }

  closePopover() {
    this.setState({ isOpened: false });
  }

  editAppointment() {
    this.closePopover();
    this.props.selectAppointment(this.props.appointment);
  }

  editPatient(id) {
    this.props.push(`/patients/${id}`);
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
      chair,
      practitioner,
      isNoteFormActive,
      isFollowUpsFormActive,
      isRecallsFormActive,
    } = this.props;
    const isAnyFormActive = isNoteFormActive || isFollowUpsFormActive || isRecallsFormActive;
    const { isOpened, nameContainerOffsetWidth, nameContainerOffset } = this.state;

    const applicationStyle = {
      ...appStyle,
      boxShadow: isOpened
        ? '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.2)'
        : 'none',
    };

    // functions to check if there is enough room to display the AppointmentHours inline
    const canShowAppointmentBelow = () => heightCalc >= displayDurationHeight;

    const canInlineAppointment = () =>
      !canShowAppointmentBelow() && nameContainerOffsetWidth >= nameContainerOffset;

    return (
      <Popover
        isOpen={isOpened && !selectedAppointment}
        body={[
          <AppointmentInfo
            appointment={appointment}
            patient={patient}
            closePopover={this.closePopover}
            editAppointment={this.editAppointment}
            scheduleView={scheduleView}
            editPatient={this.editPatient}
            handleGoToChat={() => {
              this.props.getOrCreateChatForPatient(patient.id);
            }}
            chair={chair}
            practitioner={practitioner}
          />,
        ]}
        preferPlace={placement}
        tipSize={12}
        onOuterAction={!isAnyFormActive && this.closePopover}
        className={styles.appPopover}
      >
        <Button
          onClick={this.togglePopover}
          onDoubleClick={this.editAppointment}
          className={styles.appointmentContainer}
          style={containerStyle}
          data-test-id={`appointment_${patient.get('firstName')}${patient.get('lastName')}`}
        >
          <div className={styles.showAppointment} style={applicationStyle}>
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
                <AppointmentHours startDate={startDate} endDate={endDate} inline />
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
  appointment: PropTypes.shape(appointmentShape).isRequired,
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
  patient: PropTypes.shape(patientShape).isRequired,
  isPatientConfirmed: PropTypes.bool,
  isReminderSent: PropTypes.bool,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  getOrCreateChatForPatient: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  patientChat: PropTypes.string,
  practitioner: PropTypes.arrayOf(PropTypes.shape(practitionerShape)).isRequired,
  chair: PropTypes.arrayOf(PropTypes.shape(chairShape)).isRequired,
  isNoteFormActive: PropTypes.bool.isRequired,
  isFollowUpsFormActive: PropTypes.bool.isRequired,
  isRecallsFormActive: PropTypes.bool.isRequired,
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
  patientChat: null,
};

const mapStateToProps = ({ chat, entities, dashboard, patientTable }, { appointment }) => {
  const practitioner = entities
    .getIn(['practitioners', 'models'])
    .toArray()
    .find(prac => prac.id === appointment.practitionerId);
  const chair = entities
    .getIn(['chairs', 'models'])
    .toArray()
    .find(ch => ch.id === appointment.chairId);

  return {
    chair,
    practitioner,
    isNoteFormActive: patientTable.get('isNoteFormActive'),
    isFollowUpsFormActive: patientTable.get('isFollowUpsFormActive'),
    isRecallsFormActive: patientTable.get('isRecallsFormActive'),
    dashboardDate: dashboard.get('dashboardDate'),
    patientChat: chat.get('patientChat'),
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      push,
      getOrCreateChatForPatient,
    },
    dispatch,
  );

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ShowAppointment);
