
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import moment from 'moment';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { createBrowserHistory } from 'history';
import Popover from 'react-popover';
import AppointmentInfo from './AppointmentInfo';
import { selectAppointment, setScheduleDate } from '../../../actions/schedule';
import { appointmentShape, patientShape, practitionerShape, chairShape } from '../PropTypeShapes';
import styles from './styles.scss';

class AppointmentPopover extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isOpen: false,
    };

    this.setOpen = this.setOpen.bind(this);
    this.closeOnScroll = this.closeOnScroll.bind(this);
    this.handleEditAppointment = this.handleEditAppointment.bind(this);
  }

  componentDidMount() {
    if (this.props.scrollId) {
      document.getElementById(this.props.scrollId).addEventListener('scroll', this.closeOnScroll);
    }

    window.addEventListener('scroll', this.closeOnScroll);
  }

  setOpen(value) {
    this.setState({
      isOpen: value,
    });
  }

  handleEditAppointment() {
    const { appointment } = this.props;

    const browserHistory = createBrowserHistory();
    const location = browserHistory.location.pathname;

    if (location === '/') {
      this.props.setScheduleDate({
        scheduleDate: moment(this.props.dashboardDate),
      });
    }

    const mergeApp = Object.assign(appointment.toJS(), {
      appModel: appointment,
    });
    this.props.selectAppointment(mergeApp);
    this.props.push('/schedule');
  }

  closeOnScroll() {
    this.setState({
      isOpen: false,
    });
  }

  render() {
    const {
      placement, patient, appointment, children, chair, practitioner,
    } = this.props;

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
            chair={chair[0]}
            practitioner={practitioner[0]}
          />,
        ]}
        preferPlace={placement || 'right'}
        tipSize={12}
        onOuterAction={() => this.setOpen(false)}
      >
        <div className={styles.appLink} onDoubleClick={this.handleEditAppointment}>
          {React.Children.map(children, patientLink =>
            React.cloneElement(patientLink, {
              onClick: () => this.setOpen(true),
            }))}
        </div>
      </Popover>
    );
  }
}

function mapStateToProps({ entities, dashboard }, { appointment }) {
  const practitioner = entities
    .getIn(['practitioners', 'models'])
    .toArray()
    .filter(prac => prac.id === appointment.practitionerId);
  const chair = entities
    .getIn(['chairs', 'models'])
    .toArray()
    .filter(ch => ch.id === appointment.chairId);

  return {
    chair,
    practitioner,
    dashboardDate: dashboard.get('dashboardDate'),
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(
    {
      push,
      selectAppointment,
      setScheduleDate,
    },
    dispatch,
  );
}

AppointmentPopover.propTypes = {
  patient: PropTypes.shape(patientShape).isRequired,
  appointment: PropTypes.shape(appointmentShape).isRequired,
  practitioner: PropTypes.arrayOf(PropTypes.shape(practitionerShape)),
  chair: PropTypes.arrayOf(PropTypes.shape(chairShape)),
  placement: PropTypes.string,
  scrollId: PropTypes.string,
  push: PropTypes.func.isRequired,
  selectAppointment: PropTypes.func.isRequired,
  children: PropTypes.element.isRequired,
  dashboardDate: PropTypes.oneOfType([PropTypes.instanceOf(Date), PropTypes.string]).isRequired,
  setScheduleDate: PropTypes.func.isRequired,
};

AppointmentPopover.defaultProps = {
  practitioner: null,
  chair: null,
  placement: 'right',
  scrollId: '',
};

export default connect(mapStateToProps, mapDispatchToProps)(AppointmentPopover);
