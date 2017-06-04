import React, { Component, PropTypes } from 'react';
import { List } from '../../../library';
import AppointmentsItem from './AppointmentsItem';

class AppointmentsList extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      appointments,
      patients,
      services,
      practitioners,
    } = this.props;

    console.log(patients);

    return (
      <List>
        {appointments.toArray().map((app, index) => {
          console.log(app.get('serviceId'));
          return (
            <AppointmentsItem
              key={`appointmentsList${index}`}
              appointment={app}
              patient={patients.get(app.get('patientId')).toJS()}
              service={services.get(app.get('serviceId')).toJS()}
              practitioner={practitioners.get(app.get('practitionerId')).toJS()}
            />
          )
        })}
      </List>
    )
  }

}

export default AppointmentsList;
