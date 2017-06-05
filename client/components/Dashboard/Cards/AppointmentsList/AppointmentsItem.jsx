import React, { Component, PropTypes } from 'react';
import { ListItem } from '../../../library'
import ShowDateInfo from './ShowDateInfo';
import ShowPatientInfo from './ShowPatientInfo';
import ShowOtherInfo from './ShowOtherInfo';
import styles from './styles.scss';

class AppointmentsItem extends Component {
  constructor(props) {
    super(props)
  }

  render() {
    const {
      appointment,
      service,
      patient,
      practitioner,
      chair,
    } = this.props;

    const borderStyle = {
      borderLeft: '10px solid',
      borderLeftColor: practitioner.color,
    };

    return (
      <ListItem className={styles.appointmentListItem} style={borderStyle}>
        <ShowDateInfo
          appointment={appointment}
        />
        <ShowPatientInfo
          patient={patient}
          appointment={appointment}
          service={service}
          chair={chair}
        />
        <ShowOtherInfo
          patient={patient}
          appointment={appointment}
        />
      </ListItem>
    );
  }

}

export default AppointmentsItem;
