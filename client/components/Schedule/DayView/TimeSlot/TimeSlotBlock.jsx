
import React, { Component, PropTypes } from 'react';
import styles from '../styles.scss';
import ShowAppointment from "./ShowAppointment";

class TimeSlotBlock extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const {
      practitioner,
      slotData,
      timeSlotHeight,
      services,
      chairs,
      patients,
      bgColor,
    } = this.props;

    const apps = slotData.appointments;
    const filteredApps = apps.filter((app) => {
       return app.practitionerId === practitioner.toJS().id;
    }).map((app)=>{
      const service = services.get(app.get('serviceId'));
      const patient = patients.get(app.get('patientId'));
      const chair = chairs.get(app.get('chairId'));

      return Object.assign({}, app.toJS(), {
        serviceData: service.get('name'),
        chairData: chair.get('name'),
        patientData: patient,
      });
    });

    return (
      <div className={styles.dayView_body_timeSlot} style={timeSlotHeight}>
        {filteredApps.map((app, index)=>{
          return(
            <ShowAppointment
              key={index}
              appointment={app}
              bgColor={bgColor}
            />
          );
        })}
      </div>
    );
  }
}

export default TimeSlotBlock;
