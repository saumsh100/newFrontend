
import React, { Component, PropTypes } from 'react';
import { List } from '../../../library';
import AppointmentsItem from './AppointmentsItem';
import { SortByFirstName, SortByStartDate } from '../../../library/util/SortEntities';
import styles from './styles.scss';

class AppointmentsList extends Component {
  constructor(props) {
    super(props);
    this.handleAppointmentClick = this.handleAppointmentClick.bind(this);
    this.handlePatientClick = this.handlePatientClick.bind(this);

  }

  handleAppointmentClick(id) {
    const {
      push,
      //selectAppointment,
      //appointments,
    } = this.props;

    push('/schedule');
    //selectAppointment(appointments.get(id).toJS());
  }

  handlePatientClick(id) {
    const {
      setSelectedPatientId,
      push,
    } = this.props;

    setSelectedPatientId(id);
    push('/patients/list');
  }

  render() {
    const {
      appointments,
      patients,
      services,
      chairs,
      practitioners,
    } = this.props;

    const sortedAppointments = appointments.toArray().sort(SortByStartDate);

    // This sets the colors for each appointment based on practitioner

    /*
    const sortedPractitioners = practitioners.toArray().sort(SortByFirstName);

    const colors = ['#FF715A', '#FFC45A', '#2CC4A7', '#8CBCD6',];
    const colorLen = colors.length;
    const reset = Math.ceil((sortedPractitioners.length - colorLen) / colorLen);

    for (let j = 1; j <= reset; j++) {
      for (let i = 0; i < colorLen; i++) {
        colors.push(colors[i]);
      }
    }

    const practitionersArray = sortedPractitioners.map((prac, index) => {
      return Object.assign({}, prac.toJS(), {
        color: colors[index],
      });
    });*/

    return (
      <List className={styles.appointmentList}>
        {sortedAppointments.map((app, index) => {
          //const practitioner = practitionersArray.find(prac => prac.id === app.practitionerId);
          const chair= chairs.get(app.chairId);
          const patient= patients.get(app.patientId);
          const service= services.get(app.serviceId);

          return (
            <AppointmentsItem
              key={`appointmentsList${index}`}
              appointment={app}
              chair={chair}
              patient={patient}
              service={service}
              index={index}
              //practitioner={practitioner}
              handleAppointmentClick={this.handleAppointmentClick}
              handlePatientClick={this.handlePatientClick}
            />
          );
        })}
      </List>
    );
  }
}

AppointmentsList.propTypes = {
  appointments: PropTypes.object.isRequired,
  patients: PropTypes.object.isRequired,
  services: PropTypes.object.isRequired,
  chairs: PropTypes.object.isRequired,
};

export default AppointmentsList;
