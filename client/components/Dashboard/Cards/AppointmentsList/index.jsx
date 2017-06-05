import React, { Component, PropTypes } from 'react';
import { List } from '../../../library';
import AppointmentsItem from './AppointmentsItem';
import { SortByFirstName, SortByStartDate } from '../../../library/util/SortEntities';
import styles from './styles.scss';

class AppointmentsList extends Component {
  constructor(props) {
    super(props)
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
    const sortedPractitioners = practitioners.toArray().sort(SortByFirstName);

    const colors = ['#FF715A', '#FFC45A', '#2CC4A7', '#8CBCD6',];
    const colorLen = colors.length;
    const colorArray = [];
    const reset = Math.ceil(( sortedPractitioners.length - colorLen) / colorLen);

    for(let j = 0 ; j <= reset; j++) {
      for(let i = 0; i < colorLen;  i++) {
        colorArray.push(colors[i])
      }
    }

    let practitionersArray = sortedPractitioners.map((prac, index) => {
      return Object.assign({}, prac.toJS(), {
        color: colorArray[index],
      });
    });


    return (
      <List className={styles.appointmentList}>
        {sortedAppointments.map((app, index) => {
          const practitioner = practitionersArray.find(prac => prac.id === app.practitionerId);
          return (
            <AppointmentsItem
              key={`appointmentsList${index}`}
              appointment={app}
              chair={chairs.get(app.chairId)}
              patient={patients.get(app.patientId).toJS()}
              service={services.get(app.serviceId).toJS()}
              practitioner={practitioner}
            />
          )
        })}
      </List>
    )
  }

}

export default AppointmentsList;
