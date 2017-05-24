
import React, { Component, PropTypes } from 'react';
import ShowAppointment from './ShowAppointment';
import styles from '../styles.scss';

class AppointmentList extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      practitioner,
      practIndex,
      columnWidth,
      startHour,
      endHour,
      services,
      chairs,
      patients,
      appointments,
      selectAppointment,
      bgColor,
    } = this.props;

    const filteredApps = appointments.filter((app) => {
      return app.practitionerId === practitioner.toJS().id;
    }).map((app) => {
      const service = services.get(app.get('serviceId'));
      const patient = patients.get(app.get('patientId'));
      const chair = chairs.get(app.get('chairId'));

      return Object.assign({}, app.toJS(), {
        appModel: app,
        serviceData: service.get('name'),
        chairData: chair.get('name'),
        patientData: patient,
      });
    });

    return (
      <div>
        {filteredApps.map((app, index) => {
          return (
            <ShowAppointment
              key={index}
              practIndex={practIndex}
              appointment={app}
              bgColor={bgColor}
              selectAppointment={selectAppointment}
              startHour={startHour}
              endHour={endHour}
              columnWidth={columnWidth}
            />
          );
        })}
      </div>
    );
  }
}

export default AppointmentList;
