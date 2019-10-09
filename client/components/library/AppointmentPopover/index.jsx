
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import Popover from 'react-popover';
import AppointmentInfo from './AppointmentInfo';
import { getOrCreateChatForPatient } from '../../../thunks/chat';
import { selectAppointment, setScheduleDate } from '../../../actions/schedule';
import { appointmentShape, patientShape, practitionerShape, chairShape } from '../PropTypeShapes';
import Appointments from '../../../entities/models/Appointments';
import styles from './styles.scss';

class AppointmentPopover extends Component {
  constructor(props) {
    super(props);
    this.state = { isOpen: false };

    this.setOpen = this.setOpen.bind(this);
    this.closeOnScroll = this.closeOnScroll.bind(this);
    this.handleEditAppointment = this.handleEditAppointment.bind(this);
    this.editPatient = this.editPatient.bind(this);
  }

  componentDidMount() {
    if (this.props.scrollId) {
      document.getElementById(this.props.scrollId).addEventListener('scroll', this.closeOnScroll);
    }

    window.addEventListener('scroll', this.closeOnScroll);
  }

  componentDidUpdate(prevProps) {
    if (prevProps.patientChat === null && prevProps.patientChat !== this.props.patientChat) {
      this.props.push(`/chat/${this.props.patientChat}`);
    }
  }

  setOpen(value) {
    this.setState({ isOpen: value });
  }

  handleEditAppointment() {
    const { appointment } = this.props;

    const browserHistory = createBrowserHistory();
    const location = browserHistory.location.pathname;

    if (location === '/') {
      this.props.setScheduleDate({ scheduleDate: moment(this.props.dashboardDate).toISOString() });
    }
    const mergeApp = {
      ...(appointment instanceof Appointments ? appointment.toJS() : appointment),
      ...{ appModel: appointment },
    };
    this.props.selectAppointment(mergeApp);
    this.props.push('/schedule');
  }

  editPatient(id) {
    this.props.push(`/patients/${id}`);
  }

  closeOnScroll() {
    this.setState({ isOpen: false });
  }

  render() {
    const {
      placement,
      patient,
      appointment,
      children,
      chair,
      practitioner,
      isNoteFormActive,
      isFollowUpsFormActive,
      isRecallsFormActive,
    } = this.props;
    const isAnyFormActive = isNoteFormActive || isFollowUpsFormActive || isRecallsFormActive;
    return (
      <Popover
        className={styles.appPopover}
        isOpen={this.state.isOpen}
        body={[
          <AppointmentInfo
            closePopover={() => this.setOpen(false)}
            patient={patient}
            appointment={appointment}
            editAppointment={this.handleEditAppointment}
            editPatient={this.editPatient}
            patientUrl={`/patients/${patient.id}`}
            handleGoToChat={() => {
              this.props.getOrCreateChatForPatient(patient.id);
            }}
            chair={chair}
            practitioner={practitioner}
          />,
        ]}
        preferPlace={placement || 'right'}
        tipSize={12}
        onOuterAction={() => !isAnyFormActive && this.setOpen(false)}
      >
        <div className={styles.appLink} onDoubleClick={this.handleEditAppointment}>
          {React.Children.map(children, patientLink =>
            React.cloneElement(patientLink, { onClick: () => this.setOpen(true) }))}
        </div>
      </Popover>
    );
  }
}

AppointmentPopover.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  appointment: PropTypes.oneOfType([
    PropTypes.instanceOf(Appointments),
    PropTypes.shape(appointmentShape),
  ]).isRequired,
  practitioner: PropTypes.arrayOf(PropTypes.shape(practitionerShape)),
  chair: PropTypes.arrayOf(PropTypes.shape(chairShape)),
  placement: PropTypes.string,
  scrollId: PropTypes.string,
  push: PropTypes.func.isRequired,
  selectAppointment: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  dashboardDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
  setScheduleDate: PropTypes.func.isRequired,
  getOrCreateChatForPatient: PropTypes.func.isRequired,
  patientChat: PropTypes.string,
  isNoteFormActive: PropTypes.bool.isRequired,
  isFollowUpsFormActive: PropTypes.bool.isRequired,
  isRecallsFormActive: PropTypes.bool.isRequired,
};

AppointmentPopover.defaultProps = {
  practitioner: null,
  chair: null,
  placement: 'right',
  scrollId: '',
  patientChat: null,
};

function mapStateToProps({ entities, dashboard, chat, patientTable }, { appointment }) {
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
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      push,
      selectAppointment,
      setScheduleDate,
      getOrCreateChatForPatient,
    },
    dispatch,
  );
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(AppointmentPopover);
