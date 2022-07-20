import React, { Component, createRef } from 'react';
import PropTypes from 'prop-types';
import Popover from 'react-popover';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { push } from 'connected-react-router';
import classNames from 'classnames';
import { differenceInMinutes } from 'date-fns';
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
import styles from '../reskin-styles.scss';

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
    this.nameContainer = createRef();
    this.togglePopover = this.togglePopover.bind(this);
    this.closePopover = this.closePopover.bind(this);
    this.editAppointment = this.editAppointment.bind(this);
    this.editPatient = this.editPatient.bind(this);
  }

  componentDidMount() {
    // This prevents setState to be called indefinitely
    if (this.state.nameContainerOffsetWidth !== this.nameContainer.current.offsetWidth) {
      this.setState({ nameContainerOffsetWidth: this.nameContainer.current.offsetWidth });
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.patientChat === null && prevProps.patientChat !== this.props.patientChat) {
      this.props.push(`/chat/${this.props.patientChat}`);
    }
  }

  get appointmentHoursClassName() {
    return !this.props.patient && styles.patientNotFound;
  }

  get patientNameDisplay() {
    const { patient } = this.props;
    if (!patient) {
      return (
        <div className={styles.patientNotFound}>
          Patient Not Found
          <Icon type="solid" icon="exclamation-circle" className={styles.patientNotFoundIcon} />
        </div>
      );
    }
    return `${patient.get('firstName')} ${patient.get('lastName')}`;
  }

  togglePopover() {
    const { isOpened } = this.state;
    this.setState({ isOpened: !isOpened });
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
      timezone,
      minHeight,
    } = this.props;

    const isAnyFormActive = isNoteFormActive || isFollowUpsFormActive || isRecallsFormActive;
    const { isOpened, nameContainerOffsetWidth, nameContainerOffset } = this.state;

    const patientNotFoundStyle = patient
      ? {}
      : {
          backgroundColor: '#ffffff',
          border: '1px solid red',
          color: 'red',
        };

    const applicationStyle = {
      ...appStyle,
      ...patientNotFoundStyle,
      boxShadow: isOpened
        ? '0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.2)'
        : 'none',
      minHeight,
    };

    // functions to check if there is enough room to display the AppointmentHours inline
    const canShowAppointmentBelow = () => heightCalc >= displayDurationHeight;

    const canInlineAppointment = () =>
      !canShowAppointmentBelow() && nameContainerOffsetWidth >= nameContainerOffset;
    const timeBoxInMinutes = differenceInMinutes(new Date(endDate), new Date(startDate));
    const isShortTimeBox = timeBoxInMinutes <= 30;
    return (
      <Popover
        isOpen={isOpened && !selectedAppointment}
        body={[
          <AppointmentInfo
            appointment={appointment}
            patient={patient}
            errorTitle={!this.props.patient && 'Patient Not Found'}
            errorMessage={!this.props.patient && 'Please validate appointment in your PMS.'}
            closePopover={this.closePopover}
            editAppointment={this.editAppointment}
            scheduleView={scheduleView}
            editPatient={this.editPatient}
            handleGoToChat={() => {
              this.props.getOrCreateChatForPatient(patient.id);
            }}
            chair={chair}
            practitioner={practitioner}
            timezone={timezone}
            key="AppointmentInfo"
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
          className={classNames(
            styles.appointmentContainer,
            styles[`hoverStyle-${appStyle.iconColor}`],
            {
              [styles.less30minTimebox]: isShortTimeBox,
            },
          )}
          style={containerStyle}
          data-test-id={`appointment_${patient && patient.get('firstName')}${
            patient && patient.get('lastName')
          }`}
        >
          <div className={styles.showAppointment} style={applicationStyle}>
            {isPatientConfirmed || isReminderSent ? (
              <div className={styles.icon}>
                {isPatientConfirmed ? (
                  <Icon
                    size={1}
                    icon="check-circle"
                    type="solid"
                    className={styles[appStyle.iconColor]}
                  />
                ) : (
                  <Icon size={1} icon="clock-o" className={styles[appStyle.iconColor]} />
                )}
              </div>
            ) : null}

            <div className={styles.nameContainer} ref={this.nameContainer}>
              <div className={styles.nameContainer_name}>{this.patientNameDisplay}</div>

              {(canInlineAppointment() || isShortTimeBox) && (
                <AppointmentHours
                  timezone={timezone}
                  startDate={startDate}
                  endDate={endDate}
                  timeBoxInMinutes={timeBoxInMinutes}
                  inline
                  className={this.appointmentHoursClassName}
                />
              )}
            </div>

            {canShowAppointmentBelow() && (
              <AppointmentHours
                timezone={timezone}
                startDate={startDate}
                timeBoxInMinutes={timeBoxInMinutes}
                endDate={endDate}
                className={this.appointmentHoursClassName}
              />
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
    iconColor: PropTypes.string,
  }),
  patient: PropTypes.shape(patientShape).isRequired,
  isPatientConfirmed: PropTypes.bool,
  isReminderSent: PropTypes.bool,
  startDate: PropTypes.string,
  endDate: PropTypes.string,
  getOrCreateChatForPatient: PropTypes.func.isRequired,
  push: PropTypes.func.isRequired,
  patientChat: PropTypes.string,
  practitioner: PropTypes.shape(practitionerShape).isRequired,
  chair: PropTypes.shape(chairShape).isRequired,
  isNoteFormActive: PropTypes.bool.isRequired,
  isFollowUpsFormActive: PropTypes.bool.isRequired,
  isRecallsFormActive: PropTypes.bool.isRequired,
  timezone: PropTypes.string.isRequired,
  minHeight: PropTypes.string.isRequired,
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

const mapStateToProps = ({ chat, entities, dashboard, patientTable, auth }, { appointment }) => {
  const practitioner = entities
    .getIn(['practitioners', 'models'])
    .toArray()
    .find((prac) => prac.id === appointment.practitionerId);
  const chair = entities
    .getIn(['chairs', 'models'])
    .toArray()
    .find((ch) => ch.id === appointment.chairId);

  return {
    chair,
    practitioner,
    isNoteFormActive: patientTable.get('isNoteFormActive'),
    isFollowUpsFormActive: patientTable.get('isFollowUpsFormActive'),
    isRecallsFormActive: patientTable.get('isRecallsFormActive'),
    dashboardDate: dashboard.get('dashboardDate'),
    patientChat: chat.get('patientChat'),
    timezone: auth.get('timezone'),
  };
};

const mapDispatchToProps = (dispatch) =>
  bindActionCreators(
    {
      push,
      getOrCreateChatForPatient,
    },
    dispatch,
  );

export default connect(mapStateToProps, mapDispatchToProps)(ShowAppointment);
